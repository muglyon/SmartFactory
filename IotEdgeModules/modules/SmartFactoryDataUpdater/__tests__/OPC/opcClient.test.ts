
import * as opcua from 'node-opcua';
import OpcClient from '../../src/OPC/opcClient';
import { PnType } from '../../types/pnType';
global.console = require("../__mocks__/console");

describe('opcClient tests', () => {
    let shouldReject = false
    let session: any;

    const config: PnType = {
            "EndpointUrl": "endpoint",
            "UseSecurity": false,
            "OpcNodes": [
                {
                    "Id": "ns=2;s=id1",
                    "DisplayName": "item1.sensor1"
                },
                {
                    "Id": "ns=2;s=id2",
                    "DisplayName": "item1.sensor2"
                },
            ]
        }
    

    beforeEach(() => {

        shouldReject = false
        session = {
            writeSingleNode: jest.fn((nodeToWrite: opcua.NodeIdLike, value: opcua.Variant) => new Promise<opcua.StatusCode>((res, rej) => {
                if (!shouldReject) {
                    res(new opcua.ConstantStatusCode({
                        description: "good message",
                        name: "OK",
                        value: 200
                    }))
                } else {
                    rej(new Error('error !'))
                }
            })),
            readVariableValue: jest.fn((node: string) => {
                return new Promise<opcua.DataValue>((res, rej) => {
                    res(new opcua.DataValue({
                        value: {
                            dataType: opcua.DataType.Byte,
                            value: 6
                        }
                    }))
                })
            }),

            getBuiltInDataType: jest.fn((node: opcua.NodeId) => new Promise<opcua.DataType>((res, rej) => {
                res(opcua.DataType.Double)
            }))

        }
        opcua.OPCUAClient.create = (options: opcua.OPCUAClientOptions) => {
            return {
                connect: (hostname: string) => new Promise((res, rej) => {
                    expect(hostname).toEqual('endpoint')
                    res()
                }),
                createSession: () => new Promise((res, rej) => {
                    res(session)
                })

            } as any as opcua.OPCUAClient
        }
    });

    test('should connect and create session', async () => {
        let isSessionCreated = false
        opcua.OPCUAClient.create = (options: opcua.OPCUAClientOptions) => {
            return {
                connect: (hostname: string) => new Promise((res, rej) => {
                    expect(hostname).toEqual('endpoint')
                    res()
                }),
                createSession: () => new Promise((res, rej) => {
                    isSessionCreated = true;
                    res()
                }
                )

            } as any as opcua.OPCUAClient
        }

        const opcClient = new OpcClient(config)
        await opcClient.connectClient()

        expect(isSessionCreated).toBe(true)
    });

    test('Given an unknown item when sendUpdate then throw error', async () => {

        let isRejected = false;
        const opcClient = new OpcClient(config)
        await opcClient.connectClient()

        try {
            await opcClient.sendUpdate({
                "UnknownItem": 3
            })
        } catch (e) {
            expect(e.message).toBe('Unknown node -> UnknownItem')
            isRejected = true
        }

        expect(isRejected).toBe(true)

        expect(session.writeSingleNode).not.toHaveBeenCalled()

    })

    test('Given a good double item when sendUpdate then return OK', async () => {

        const opcClient = new OpcClient(config)
        await opcClient.connectClient()

        let result = await opcClient.sendUpdate({
            "item1.sensor1": 3
        })

        expect(session.writeSingleNode).toHaveBeenCalledWith("ns=2;s=id1", {
            dataType: opcua.DataType.Double,
            value: 3
        })
        expect(result).toBe("OK")

    })

    test('Given a good item when readValue then return 6', async () => {
        const opcClient = new OpcClient(config)
        // await opcClient.sessionInit()

        let result = await opcClient.readValue("item1.sensor1")

        expect(session.readVariableValue).toHaveBeenCalledWith("ns=2;s=id1")

        expect(result).toBe(6)

    })

    test('Given a good boolean item when sendUpdate then return OK', async () => {

        const opcClient = new OpcClient(config)
        await opcClient.connectClient()

        session.getBuiltInDataType = jest.fn((node: opcua.NodeId) => new Promise<opcua.DataType>((res, rej) => {
            res(opcua.DataType.Boolean)
        }))

        let result = await opcClient.sendUpdate({
            "item1.sensor1": true
        })

        expect(session.writeSingleNode).toHaveBeenCalledWith("ns=2;s=id1", {
            dataType: opcua.DataType.Boolean,
            value: true
        })

        expect(result).toBe("OK")

    })

    test('Given a valid displayname for readValue then session should be call with the correct id', async () => {

        const opcClient = new OpcClient(config)
        await opcClient.connectClient()

        let result = await opcClient.readValue("item1.sensor1")

        expect(session.readVariableValue).toHaveBeenCalledWith("ns=2;s=id1")

    })

    
    test('Given a invalid displayname for readValue then session should not be called', async () => {

        expect.assertions(3)
        const opcClient = new OpcClient(config)
        await opcClient.connectClient()

        let result = await opcClient.readValue("randomDisplayName").catch((err) => {
            expect(err.message).toBe("Unknown DisplayName ==> randomDisplayName")
        })

        expect(session.readVariableValue).not.toHaveBeenCalled()

    })

    test("Given a known displayName, containNode should return true", () => {
        const opcClient = new OpcClient(config)

        expect(opcClient.containNode("item1.sensor1")).toBe(true)
    })

    test("Given an unknown displayName, containNode should return false", () => {
        const opcClient = new OpcClient(config)

        expect(opcClient.containNode("Unknown.node")).toBe(false)
    })

    
    test("Given a config, updateNodes should update local config", () => {
        const opcClient = new OpcClient(config)

        opcClient.updateNodes([])
        expect(opcClient.nodes).toEqual([])
    })
})
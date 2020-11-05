const opcClientMock = jest.fn().mockImplementation(function () {
    return {
        shouldContainNode: true,
        containNode: jest.fn().mockImplementation((id: string) => this.shouldContainNode),
        updateNodes: jest.fn(),
        sendUpdate: jest.fn(),
        readValue: jest.fn()
    }
})
jest.mock("../../src/OPC/opcClient", () => ({
    __esModule: true,
    default: opcClientMock
}))

import * as opcua from 'node-opcua';
import OpcClient from '../../src/OPC/opcClient';
import OpcManager from '../../src/OPC/OpcManager';
import mockfs from 'mock-fs'
import { UnknownNodeError } from '../../src/errors/UnknownNodeError';
global.console = require("../__mocks__/console");

describe('OpcManager tests', () => {

    const pnJsonContent = JSON.stringify([
        {
            "EndpointUrl": "endpoint1",
            "UseSecurity": false,
            "OpcNodes": [
                {
                    "Id": "ns=2;s=id1",
                    "DisplayName": "endpoint1.item1.sensor1"
                },
                {
                    "Id": "ns=2;s=id2",
                    "DisplayName": "endpoint1.item1.sensor2"
                },
            ]
        },
        {
            "EndpointUrl": "endpoint2",
            "UseSecurity": false,
            "OpcNodes": [
                {
                    "Id": "ns=2;s=id11",
                    "DisplayName": "endpoint2.item1.sensor1"
                },
                {
                    "Id": "ns=2;s=id12",
                    "DisplayName": "endpoint2.item1.sensor2"
                },
            ]
        }
    ])

    beforeEach(() => {
        mockfs({
            '/appdata': {
                'pn.json': pnJsonContent,
            },
        });

    });

    afterEach(() => {
        mockfs.restore()
        opcClientMock.mockRestore()
    })

    it("Call FindServer with an unknown node should reject an error", () => {
        const opcManager = new OpcManager()

        function findServer() {
            opcManager.findServer('randomDisplayName')
        }

        expect(findServer).toThrow(UnknownNodeError)
    })

    it("Call FindServer with a node present in a known OpcClient should call updateNodes", () => {
        const opcManager = new OpcManager()

        const mock = jest.fn()

        opcManager.opcClients.push({
            hostname: "endpoint2",
            updateNodes: mock
        } as any as OpcClient)

        opcManager.findServer("endpoint2.item1.sensor1")

        expect(mock.mock.calls.length).toBe(1)
        expect(mock.mock.calls[0][0]).toEqual([
            {
                "Id": "ns=2;s=id11",
                "DisplayName": "endpoint2.item1.sensor1"
            },
            {
                "Id": "ns=2;s=id12",
                "DisplayName": "endpoint2.item1.sensor2"
            },
        ])
    })

    it("Call FindServer with a node from a new hostname should push in client list", () => {
        const opcManager = new OpcManager()

        opcManager.findServer("endpoint2.item1.sensor1")

        expect(opcManager.opcClients.length).toBe(1)
        expect(opcClientMock.mock.calls.length).toBe(1)
        expect(opcClientMock.mock.calls[0][0]).toEqual({
            "EndpointUrl": "endpoint2",
            "UseSecurity": false,
            "OpcNodes": [
                {
                    "Id": "ns=2;s=id11",
                    "DisplayName": "endpoint2.item1.sensor1"
                },
                {
                    "Id": "ns=2;s=id12",
                    "DisplayName": "endpoint2.item1.sensor2"
                },
            ]
        })
    })

    it("Call readData with a known node should call readValue from opcClient", async () => {
        expect.assertions(2)
        const opcManager = new OpcManager()

        const mock = jest.fn()

        opcManager.opcClients.push({
            hostname: "endpoint2",
            containNode: (id: string) => true,
            readValue: mock
        } as any as OpcClient)

        await opcManager.readData("DisplayName")

        expect(mock.mock.calls.length).toBe(1)
        expect(mock.mock.calls[0][0]).toEqual("DisplayName")
    })

    it("Call readData with an unknown node should create opcClient and call readValue", async () => {
        expect.assertions(4)
        const opcManager = new OpcManager()

        const readValueMock = jest.fn()
        const mock = jest.fn().mockImplementation(() => ({
            readValue: readValueMock
        }))
        opcManager.findServer = mock

        await opcManager.readData("endpoint2.item1.sensor2")

        expect(mock.mock.calls.length).toBe(1)
        expect(mock.mock.calls[0][0]).toBe("endpoint2.item1.sensor2")


        expect(readValueMock.mock.calls.length).toBe(1)
        expect(readValueMock.mock.calls[0][0]).toBe("endpoint2.item1.sensor2")
    })

    it("Call readData with an unknown node from file should reject an error", async () => {
        expect.assertions(1)
        const opcManager = new OpcManager()

        const mock = jest.fn().mockImplementation(() => {
            throw new Error("Error message")
        })
        opcManager.findServer = mock


        await opcManager.readData("UnknownName").catch((err: Error) => {
            expect(err.message).toBe("Error message")
        })

    })

    it("Call updateData with an unknown node from file should reject an error", async () => {
        expect.assertions(1)
        const opcManager = new OpcManager()

        const mock = jest.fn().mockImplementation(() => {
            throw new Error("Error message")
        })
        opcManager.findServer = mock


        const promises = await opcManager.updateData({
            "UnknownNode1": 2,
            "UnknownNode2": 3
        }).catch((err) => {
            expect(err.message).toBe("Error message")
        })

    })


    it("Call updateData with known nodes from file should resolve", async () => {
        expect.assertions(3)
        const opcManager = new OpcManager()
        const sendUpdateMock = jest.fn().mockImplementation((item: string) => new Promise((res, rej) => res("Update done for " + Object.keys(item)[0])))
        opcManager.opcClients.push({
            hostname: "endpoint2",
            containNode: (id: string) => true,
            sendUpdate: sendUpdateMock
        } as any as OpcClient)

        const promises = await opcManager.updateData({
            "knownNode1": 2,
            "knownNode2": 1
        })

        expect(promises.length).toBe(2)
        expect(promises[0]).toBe("Update done for knownNode1")
        expect(promises[1]).toBe("Update done for knownNode2")


    })

    it("Call updateData with an unknown node should create opcClient and call sendUpdate", async () => {
        expect.assertions(5)
        const opcManager = new OpcManager()

        const sendUpdatemock = jest.fn()
        const mock = jest.fn().mockImplementation(() => ({
            sendUpdate: sendUpdatemock
        }))
        opcManager.findServer = mock

        opcManager.opcClients.push({
            hostname: "endpoint2",
            containNode: (id: string) => {
                if (id == "Key") {
                    return true
                } else return false
            },
            sendUpdate: sendUpdatemock
        } as any as OpcClient)

        await opcManager.updateData({
            "NewKey": 3,
            "Key": 5
        })

        expect(mock.mock.calls.length).toBe(1)
        expect(mock.mock.calls[0][0]).toBe("NewKey")


        expect(sendUpdatemock.mock.calls.length).toBe(2)
        expect(sendUpdatemock.mock.calls[0][0]).toEqual({ "NewKey": 3 })
        expect(sendUpdatemock.mock.calls[1][0]).toEqual({ "Key": 5 })
    })

})
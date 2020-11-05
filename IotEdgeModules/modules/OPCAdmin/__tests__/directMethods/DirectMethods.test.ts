
import DirectMethods from '../../src/directsMethods/DirectMethods'
import { ModuleClient } from 'azure-iot-device';
import { MethodParams, DeviceMethodRequest, DeviceMethodResponse } from 'azure-iot-device/lib/device_method';
import OpcClient from '../../src/utils/OpcClient';

describe('getNodes tests', () => {

    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules()
        process.env = { ...OLD_ENV };
        delete process.env.NODE_ENV;
    });

    afterEach(() => {
        process.env = OLD_ENV;
    });

    test('Given a bad opc configuration when getNodes then send status 500 and payload', async done => {
        expect.assertions(5);
        process.env.IOTEDGE_DEVICEID = 'deviceId'

        const client: ModuleClient = {
            invokeMethod: (deviceId: string, moduleId: string, methodParams: MethodParams) => {
                return new Promise((res) => {
                    expect(deviceId).toBe('deviceId');
                    expect(moduleId).toBe('OPCPublisher');
                    expect(methodParams).toEqual({
                        methodName: "GetConfiguredNodesOnEndpoint",
                        payload: { "EndpointUrl": 'endpoint' },
                        connectTimeoutInSeconds: 10,
                        responseTimeoutInSeconds: 10
                    });
                    res({
                        status: 501,
                        payload: "error"
                    });
                });

            },
            onMethod: (methodName: string, callback: (req: any, res: any) => void) => {
                callback(req, res);
            }
        } as any

        const req = {
            payload: {
                url: "endpoint"
            }
        } as DeviceMethodRequest

        const res = {
            send: (statusCode: number, payload: any) => {
                expect(statusCode).toEqual(501)
                expect(payload).toEqual("error")
                done()
            }
        } as unknown as DeviceMethodResponse

        new DirectMethods(client);
    });

    test('Given a good opc configuration when getNodes then send status 200 and payload', async done => {
        expect.assertions(5)
        process.env.IOTEDGE_DEVICEID = 'deviceId'

        OpcClient.prototype.getServerNode = jest.fn().mockImplementation(() => new Promise((res, rej) => res({
            toto: {
                id: "id",
                isSubscribed: true
            }
        })))

        const client: ModuleClient = {
            invokeMethod: (deviceId: string, moduleId: string, methodParams: MethodParams) => {
                return new Promise((res, rej) => {
                    expect(deviceId).toBe('deviceId')
                    expect(moduleId).toBe('OPCPublisher');
                    expect(methodParams).toEqual({
                        methodName: "GetConfiguredNodesOnEndpoint",
                        payload: { "EndpointUrl": 'endpoint' },
                        connectTimeoutInSeconds: 10,
                        responseTimeoutInSeconds: 10
                    })
                    res({
                        status: 200,
                        payload: {
                            OpcNodes: [{
                                Id: "id",
                                DisplayName: "name"
                            }]
                        }
                    })
                })

            },
            onMethod: (methodName: string, callback: (req: any, res: any) => void) => {
                callback(req, res);
            }
        } as any

        const req = {
            payload: {
                url: "endpoint"
            }
        } as DeviceMethodRequest

        const res = {
            send: (statusCode: number, payload: any) => {
                expect(statusCode).toEqual(200)
                expect(payload).toEqual({
                    toto: {
                        id: "id",
                        isSubscribed: true
                    }
                })
                done()
            }
        } as unknown as DeviceMethodResponse

        new DirectMethods(client);
    });

    test('Given a bad result when getNodes then send status 500 and payload', async done => {
        expect.assertions(10);
        process.env.IOTEDGE_DEVICEID = 'deviceId'

        OpcClient.prototype.getServerNode = jest.fn().mockImplementation(() => new Promise((res, rej) => rej("ERROR")))

        const client: ModuleClient = {
            invokeMethod: (deviceId: string, moduleId: string, methodParams: MethodParams) => {
                return new Promise((res, rej) => {
                    expect(deviceId).toBe('deviceId')
                    expect(moduleId).toBe('OPCPublisher');
                    expect(methodParams).toEqual({
                        methodName: "GetConfiguredNodesOnEndpoint",
                        payload: { "EndpointUrl": 'endpoint' },
                        connectTimeoutInSeconds: 10,
                        responseTimeoutInSeconds: 10
                    })
                    res({
                        status: 200,
                        payload: {
                            OpcNodes: [{
                                Id: "id",
                                DisplayName: "name"
                            }]
                        }
                    })
                })

            },
            onMethod: (methodName: string, callback: (req: any, res: any) => void) => {
                callback(req, res);
            }
        } as any

        const req = {
            payload: {
                url: "endpoint"
            }
        } as DeviceMethodRequest

        const res = {
            send: (statusCode: number, payload: any) => {
                expect(statusCode).toEqual(500)
                expect(payload).toEqual("ERROR")
                done()
            }
        } as unknown as DeviceMethodResponse

        new DirectMethods(client).getEndpointAndNodes(req, res);
    });

    test('Given a configuration error when getNodes then send status 500 and payload', async done => {
        expect.assertions(10)
        process.env.IOTEDGE_DEVICEID = 'deviceId'

        OpcClient.prototype.getServerNode = jest.fn().mockImplementation(() => new Promise((res, rej) => rej("ERROR")))

        const client: ModuleClient = {
            invokeMethod: (deviceId: string, moduleId: string, methodParams: MethodParams) => {
                return new Promise((res, rej) => {
                    expect(deviceId).toBe('deviceId')
                    expect(moduleId).toBe('OPCPublisher');
                    expect(methodParams).toEqual({
                        methodName: "GetConfiguredNodesOnEndpoint",
                        payload: { "EndpointUrl": 'endpoint' },
                        connectTimeoutInSeconds: 10,
                        responseTimeoutInSeconds: 10
                    })
                    rej("CONFIG_ERROR")
                })

            },
            onMethod: (methodName: string, callback: (req: any, res: any) => void) => {
                callback(req, res);
            }
        } as any

        const req = {
            payload: {
                url: "endpoint"
            }
        } as DeviceMethodRequest

        const res = {
            send: (statusCode: number, payload: any) => {
                expect(statusCode).toEqual(500)
                expect(payload).toEqual("CONFIG_ERROR")
                done()
            }
        } as unknown as DeviceMethodResponse

        new DirectMethods(client).getEndpointAndNodes(req, res);
    });
})

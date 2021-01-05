import OPCClientMock from '../../__mocks__/OPCClient.mock';

jest.mock('../../src/utils/OpcClient.ts', () => OPCClientMock);

import DirectMethods from '../../src/directsMethods/DirectMethods';
import * as getEndpointAndNodeRootModule from '../../src/getEndpointAndNodes';

describe("Direct Methods tests", () => {

    mockDirectMethod: DirectMethods;


    test("given good params for getEndpointConfig it should resolve the promise", async () => {
        const mockModuleClient = {
            onMethod: jest.fn(),
            invokeMethod: jest.fn(() => new Promise((resolve) => resolve(true)))
        } as any;
        const directMethods = new DirectMethods(mockModuleClient);

        const getEndpointConfigMockResult = await directMethods.getEndpointConfig(mockModuleClient, "opc.tcp://localhost:49320/");

        expect(getEndpointConfigMockResult).toBe(true);

    });

    test("given bad params it should reject the promise", async () => {
        const mockModuleClient = {
            onMethod: jest.fn(),
            invokeMethod: jest.fn(() => new Promise((resolve, reject) => reject(true)))
        } as any;
        const directMethods = new DirectMethods(mockModuleClient);

        await directMethods.getEndpointConfig(mockModuleClient, "opc.tcp://localhost:49320/")
            .catch((err) => {
                expect(err).toBe(true);
            });

    });

    test("given a bad payload for getNode method it should send HTTP 400 Response", () => {
        expect.assertions(1);
        const request = {
            payload: {
                test: "test"
            }
        };

        const response = {
            send: (statusCode: number, payload: any) => {
                expect(statusCode).toBe(400);
            }
        };

        const onMethodFunction = jest.fn((methodName: string, methodCallBack: (request: any, response: any) => void) => {
            methodCallBack(request, response);
        });

        const mockModuleClient = {
            onMethod: onMethodFunction,
        } as any;

        new DirectMethods(mockModuleClient);

    });

    test("given a good payload it should call getEndpointConfig method", () => {
        expect.assertions(1);
        const request = {
            payload: {
                nodeId: "bonjour",
                url: "bonjour",
                deviceId: "bonjour"
            }
        };

        const response = {
            send: (statusCode: number, payload: any) => { }
        };

        const onMethodFunction = jest.fn((methodName: string, methodCallBack: (request: any, response: any) => void) => {
            methodCallBack(request, response);
        });

        const mockModuleClient = {
            onMethod: onMethodFunction,
        } as any;

        const getEndpointConfigMock = DirectMethods.prototype.getEndpointConfig = jest.fn(() => new Promise((resolve) => resolve()));

        new DirectMethods(mockModuleClient);

        expect(getEndpointConfigMock).toHaveBeenCalledTimes(1);
    });

    test("given a bad response from getEndpointConfig it should send HTTP 500 Response", () => {
        expect.assertions(1);
        const request = {
            payload: {
                nodeId: "bonjour",
                url: "bonjour",
                deviceId: "bonjour"
            }
        };

        const response = {
            send: (statusCode: number, payload: any) => {
                expect(statusCode).toBe(500);
            }
        };

        const onMethodFunction = jest.fn((methodName: string, methodCallBack: (request: any, response: any) => void) => {
            methodCallBack(request, response);
        });

        const mockModuleClient = {
            onMethod: onMethodFunction,
        } as any;

        const getEndpointConfigMock = DirectMethods.prototype.getEndpointConfig = jest.fn(() => new Promise((resolve, reject) => reject()));

        new DirectMethods(mockModuleClient);
    });

    test("given a bad status from getEndpointConfig it should return the payload of getEndpointConfig", () => {
        expect.assertions(2);
        const request = {
            payload: {
                nodeId: "bonjour",
                url: "bonjour",
                deviceId: "bonjour"
            }
        };

        const response = {
            send: (statusCode: number, payload: any) => {
                expect(statusCode).toBe(503);
                expect(payload).toBe(true);
            }
        };

        const onMethodFunction = jest.fn((methodName: string, methodCallBack: (request: any, response: any) => void) => {
            methodCallBack(request, response);
        });

        const mockModuleClient = {
            onMethod: onMethodFunction,
        } as any;

        DirectMethods.prototype.getEndpointConfig = jest.fn(() => new Promise((resolve) => resolve({
            status: 503,
            payload: true
        })));

        new DirectMethods(mockModuleClient);
    });

    test("given a good response from getEndpointConfig it should call getEndpointAndNodes function", () => {
        expect.assertions(1);
        //@ts-ignore
        getEndpointAndNodeRootModule.default = jest.fn(() =>
            new Promise((resolve) => {
                resolve()
            })
        );

        const request = {
            payload: {
                nodeId: "bonjour",
                url: "bonjour",
                deviceId: "bonjour"
            }
        };

        const response = {
            send: (statusCode: number, payload: any) => { }
        };

        const onMethodFunction = jest.fn(async (methodName: string, methodCallBack: (request: any, response: any) => void) => {
            methodCallBack(request, response);
            expect(getEndpointAndNodeRootModule.default).toBeCalled();

        });

        const mockModuleClient = {
            onMethod: onMethodFunction,
        } as any;

        DirectMethods.prototype.getEndpointConfig = jest.fn(() => new Promise((resolve) => resolve({
            status: 200,
            payload: true
        })));

        new DirectMethods(mockModuleClient);
    });

    test("given getEndpointAndNodes resolved it should re affectate opcClientList", done => {
        expect.assertions(1);
        const expectedOPCListClient = {
            "url": true
        }
        //@ts-ignore
        getEndpointAndNodeRootModule.default = jest.fn(() =>
            new Promise((resolve) => {
                resolve({
                    newOpcClientList: expectedOPCListClient
                })
            })
        );

        const request = {
            payload: {
                nodeId: "bonjour",
                url: "bonjour",
                deviceId: "bonjour"
            }
        };
        const response = {
            send: (statusCode: number, payload: any) => {
                //@ts-ignore
                expect(this.mockDirectMethod.opcClientList).toBe(expectedOPCListClient);
                done();
            }
        };

        const onMethodFunction = jest.fn((methodName: string, methodCallBack: (request: any, response: any) => void) => {
            methodCallBack(request, response);
        });

        const mockModuleClient = {
            onMethod: onMethodFunction,
        } as any;

        DirectMethods.prototype.getEndpointConfig = jest.fn(() => new Promise((resolve) => resolve({
            status: 200,
            payload: true
        })));

        //@ts-ignore
        this.mockDirectMethod = new DirectMethods(mockModuleClient);


    });

    test("given getEndpointAndNodes resolved it should send HTTP 200 response", done => {
        expect.assertions(2);

        //@ts-ignore
        getEndpointAndNodeRootModule.default = jest.fn(() =>
            new Promise((resolve) => {
                resolve({
                    status: 200,
                    payload: true
                })
            })
        );

        const request = {
            payload: {
                nodeId: "bonjour",
                url: "bonjour",
                deviceId: "bonjour"
            }
        };

        const response = {
            send: (statusCode: number, payload: any) => {
                expect(statusCode).toBe(200);
                expect(payload).toBe(true);
                done();
            }
        };

        const onMethodFunction = jest.fn((methodName: string, methodCallBack: (request: any, response: any) => void) => {
            methodCallBack(request, response);
        });

        const mockModuleClient = {
            onMethod: onMethodFunction,
        } as any;

        DirectMethods.prototype.getEndpointConfig = jest.fn(() => new Promise((resolve) => resolve({
            status: 200,
            payload: true
        })));

        new DirectMethods(mockModuleClient);
    });
});
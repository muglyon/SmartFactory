
// import OpcClientMock from '../__mocks__/OpcClientMock';

const mock = jest.fn().mockImplementation(() => ({
    updateData: (payload: any) => {
        return new Promise<string[]>((res, rej) => {
            if(payload.return_error) {
                if(payload.unknown_node){
                    rej(new UnknownNodeError("unknown node"))
                } else {
                    rej(new Error("Not found"))
                }
            } else {
                res(["OK"])
            }
        })
    }
}))
jest.mock("../../src/OPC/OpcManager", () => ({
    __esModule: true,
    default: mock
}))

import OpcManager from '../../src/OPC/OpcManager'
import onDataUpdate from '../../src/functions/onDataUpdate'
import { DeviceMethodRequest, DeviceMethodResponse } from 'azure-iot-device';
import waitForExpect from 'wait-for-expect'
import mock_fs from 'mock-fs';
import { UnknownNodeError } from '../../src/errors/UnknownNodeError'
describe('onDataUpdate tests', () => {

    beforeAll(() => mock_fs({
        '/appdata': {
            'pn.json': '[{}]'
        }
    }))

    afterAll(() => mock_fs.restore())

    test("OpCManager should be mocked", () => {
        expect((OpcManager as jest.Mock).mock).toBeTruthy()
    })
    test('Given good opc client connection when onDataUpdate then return http 200', async () => {

        const opcManager = new OpcManager()

        const req = {
            methodName: "test",
            payload: {
                "return_error": false
            }
        }
        const res = {
            send: jest.fn()
        }

        onDataUpdate(req as DeviceMethodRequest, res as unknown as DeviceMethodResponse, opcManager)
        
        await waitForExpect(() => {
            expect(res.send).toHaveBeenCalledTimes(1);
        });

        expect(res.send).toHaveBeenCalledWith(200, ["OK"], expect.any(Function))
    });

    test("Given bad opc client connection when onDataUpdate then return http 500", async () => {

        const opcClient: OpcManager = new OpcManager();
        const req = {
            methodName: "test",
            payload: {
                "return_error": true
            }
        }
        const res = {
            send: jest.fn()
        }

        onDataUpdate(req as DeviceMethodRequest, res as unknown as DeviceMethodResponse, opcClient)
        
        await waitForExpect(() => {
            expect(res.send).toHaveBeenCalledTimes(1);
        });

        expect(res.send).toHaveBeenCalledWith(500, "Not found", expect.any(Function))
    });

    test('Given good opc client connection and bad node when onDataUpdate then return http 400', async () => {

        const opcClient: OpcManager = new OpcManager();
        const req = {
            methodName: "test",
            payload: {
                "return_error": true,
                "unknown_node": true
            }
        }
        const res = {
            send: jest.fn()
        }

        onDataUpdate(req as DeviceMethodRequest, res as unknown as DeviceMethodResponse, opcClient)
        
        await waitForExpect(() => {
            expect(res.send).toHaveBeenCalledTimes(1);
        });

        expect(res.send).toHaveBeenCalledWith(400, "unknown node", expect.any(Function))
    });
})
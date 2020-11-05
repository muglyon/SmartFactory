const mock = jest.fn().mockImplementation(function () {
    return {

        isGyroRun: false,
        updateData: jest.fn().mockReturnValue(new Promise((res, rej) => res())),

        readData: jest.fn().mockReturnValue(new Promise((res, rej) => {

            if (this.isGyroRun) {
                res(7)
            } else {
                res(5)
            }

        }))
    }
})
jest.mock("../../src/OPC/OpcManager", () => ({
    __esModule: true,
    default: mock
}))

import onEdgeDataUpdate from '../../src/functions/onEdgeDataUpdate'
import waitForExpect from 'wait-for-expect';
import { Message } from 'azure-iot-device';
import { EDGE_UPDATE_NAME, GYROPHARE_DISPLAY_NAME } from '../../src/constantes';
import OpcManager from '../../src/OPC/OpcManager';

describe('onEdgeDataUpdate tests', () => {

    test('Given a message from a unknown source then return an error', async () => {
        expect.assertions(1)
        const opcManager: OpcManager = new OpcManager()
        await onEdgeDataUpdate("randomInputName", new Message("null"), opcManager).catch((err) => {
            expect(err.message).toBe("Unknown input path randomInputName")
        })

    });

    test('Given a message without gyro_state then return an error', async () => {
        expect.assertions(1)
        const opcManager: OpcManager = new OpcManager()

        await onEdgeDataUpdate(EDGE_UPDATE_NAME, new Message(JSON.stringify({ "random_key": 2 })), opcManager).catch((err) => {
            expect(err.message).toBe("gyro_state properties missing")
        })

    });

    test('Given a message with true gyro_state when gyrophare is already on then call update with same value', async () => {
        expect.assertions(4)
        const opcManager: any = new OpcManager()
        opcManager.isGyroRun = true

        await onEdgeDataUpdate(EDGE_UPDATE_NAME, new Message(JSON.stringify({ "gyro_state": true })), opcManager)

        const readMock: jest.Mock = opcManager.readData as jest.Mock
        const updateMock: jest.Mock = opcManager.updateData as jest.Mock

        expect(readMock.mock.calls.length).toBe(1)
        expect(readMock.mock.calls[0][0]).toBe(GYROPHARE_DISPLAY_NAME)

        expect(updateMock.mock.calls.length).toBe(1)
        expect(updateMock.mock.calls[0][0]).toEqual({
            [GYROPHARE_DISPLAY_NAME]: 7
        })

    });

    test('Given a message with true gyro_state when gyrophare is off then call update with increased value', async () => {
        expect.assertions(4)
        const opcManager: any = new OpcManager()
        opcManager.isGyroRun = false

        await onEdgeDataUpdate(EDGE_UPDATE_NAME, new Message(JSON.stringify({ "gyro_state": true })), opcManager)

        const readMock: jest.Mock = opcManager.readData as jest.Mock
        const updateMock: jest.Mock = opcManager.updateData as jest.Mock

        expect(readMock.mock.calls.length).toBe(1)
        expect(readMock.mock.calls[0][0]).toBe(GYROPHARE_DISPLAY_NAME)

        expect(updateMock.mock.calls.length).toBe(1)
        expect(updateMock.mock.calls[0][0]).toEqual({
            [GYROPHARE_DISPLAY_NAME]: 7
        })

    });

    test('Given a message with false gyro_state when gyrophare is off then call update with same value', async () => {
        expect.assertions(4)
        const opcManager: any = new OpcManager()
        opcManager.isGyroRun = false

        await onEdgeDataUpdate(EDGE_UPDATE_NAME, new Message(JSON.stringify({ "gyro_state": false })), opcManager)


        const readMock: jest.Mock = opcManager.readData as jest.Mock
        const updateMock: jest.Mock = opcManager.updateData as jest.Mock

        expect(readMock.mock.calls.length).toBe(1)
        expect(readMock.mock.calls[0][0]).toBe(GYROPHARE_DISPLAY_NAME)

        expect(updateMock.mock.calls.length).toBe(1)
        expect(updateMock.mock.calls[0][0]).toEqual({
            [GYROPHARE_DISPLAY_NAME]: 5
        })


    });

    test('Given a message with false gyro_state when gyrophare is on then call update with decreased value', async () => {
        expect.assertions(4)
        const opcManager: any = new OpcManager()
        opcManager.isGyroRun = true

        await onEdgeDataUpdate(EDGE_UPDATE_NAME, new Message(JSON.stringify({ "gyro_state": false })), opcManager)

        const readMock: jest.Mock = opcManager.readData as jest.Mock
        const updateMock: jest.Mock = opcManager.updateData as jest.Mock

        expect(readMock.mock.calls.length).toBe(1)
        expect(readMock.mock.calls[0][0]).toBe(GYROPHARE_DISPLAY_NAME)

        expect(updateMock.mock.calls.length).toBe(1)
        expect(updateMock.mock.calls[0][0]).toEqual({
            [GYROPHARE_DISPLAY_NAME]: 5
        })

    });
})
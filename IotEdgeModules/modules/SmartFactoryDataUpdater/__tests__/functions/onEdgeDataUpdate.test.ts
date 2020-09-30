
import OpcClientMock from '../__mocks__/OpcClientMock';
import onEdgeDataUpdate from '../../src/functions/onEdgeDataUpdate'
import processingUpdate from '../../src/updaters/processingUpdate'
import cameraUpdate from '../../src/updaters/cameraUpdate'
import { Message } from 'azure-iot-device';
import { CAMERA_UPDATE_NAME, PROCESSING_UPDATE_NAME } from '../../src/constantes';

jest.mock('../../src/updaters/processingUpdate')

jest.mock('../../src/updaters/cameraUpdate');

describe('onEdgeDataUpdate tests', () => {

    test('Given a message from a unknown source then return an error', async () => {
        expect.assertions(1)
        const opcClient: OpcClientMock = new OpcClientMock()
        opcClient.shouldReject = false
        opcClient.statusCode = "OK"
        opcClient.isGyroRun = false

        await onEdgeDataUpdate("randomInputName", new Message("null"), opcClient).catch((err) => {
            expect(err.message).toBe("Unknown input path randomInputName")
        })

    });

    test('Given a message from a Data processing then call processingUpdate', async () => {
        expect.assertions(1)
        const opcClient: OpcClientMock = new OpcClientMock()

        await onEdgeDataUpdate(PROCESSING_UPDATE_NAME, new Message("null"), opcClient)
        expect(processingUpdate).toHaveBeenCalledWith(null, opcClient)


    });

    test('Given a message from a CameraCapture then call cameraUpdate', async () => {
        expect.assertions(1)
        const opcClient: OpcClientMock = new OpcClientMock()

        await onEdgeDataUpdate(CAMERA_UPDATE_NAME, new Message("null"), opcClient)

        expect(cameraUpdate).toHaveBeenCalledWith(null, opcClient)


    });


})

import OpcClientMock from '../__mocks__/OpcClientMock';
import onDataUpdate from '../../src/functions/onDataUpdate'
import mock from 'mock-fs';

describe('onDataUpdate tests', () => {

    beforeAll(() => mock({
        '/appdata': {
            'pn.json': '[{}]'
        }
    }))

    afterAll(() => mock.restore())
    test('Given good opc client connection when onDataUpdate then return http 200', async () => {
        expect.assertions(1);
        const opcClient: OpcClientMock = new OpcClientMock()
        opcClient.shouldReject = false
        opcClient.statusCode = "OK"

        const result = await onDataUpdate({}, opcClient)

        expect(result).toStrictEqual({
            status: 200,
            result: "OK"
        });
    });

    test("Given bad opc client connection when onDataUpdate then return http 500", async () => {
        expect.assertions(1);
        const opcClient: OpcClientMock = new OpcClientMock();
        opcClient.shouldReject = true;
        opcClient.serverError = true;
        opcClient.statusCode = "Not found";

        await onDataUpdate({}, opcClient).catch((e) => {
            expect(e.message).toBe("Not found");
        })
        
        
    });

    test('Given good opc client connection and bad node when onDataUpdate then return http 400', async () => {
        expect.assertions(1);
        const opcClient: OpcClientMock = new OpcClientMock();
        opcClient.shouldReject = true;
        opcClient.serverError = false;
        opcClient.statusCode = "unknown node";

        const result = await onDataUpdate({}, opcClient)
        
        expect(result).toStrictEqual({
            status: 400,
            result: "unknown node"
        });
    });
})
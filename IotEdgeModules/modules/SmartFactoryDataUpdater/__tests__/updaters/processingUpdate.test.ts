import { GYROPHARE_DISPLAY_NAME } from "../../src/constantes";
import processingUpdate from "../../src/updaters/processingUpdate";
import OpcClientMock from "../__mocks__/OpcClientMock";

describe("processingUpdate tests", () => {
    test('Given a message without gyro_state then return an error', async () => {
        expect.assertions(1)
        const opcClient: OpcClientMock = new OpcClientMock()
        opcClient.shouldReject = false
        opcClient.statusCode = "OK"
        opcClient.isGyroRun = false

        await processingUpdate({ "random_key": 2 }, opcClient).catch((err) => {
            expect(err.message).toBe("gyro_state properties missing")
        })

});

test('Given a message with true gyro_state when gyrophare is already on then call update with same value', async () => {
    expect.assertions(4)
    const opcClient: OpcClientMock = new OpcClientMock()
    opcClient.shouldReject = false
    opcClient.statusCode = "OK"
    opcClient.isGyroRun = true


    await processingUpdate({ "gyro_state": true }, opcClient)

    expect(opcClient.readValueCall.length).toBe(1)
    expect(opcClient.readValueCall[0]).toBe(GYROPHARE_DISPLAY_NAME)

    expect(opcClient.sendUpdateCall.length).toBe(1)
    expect(opcClient.sendUpdateCall[0]).toEqual({
        [GYROPHARE_DISPLAY_NAME]: 7
    })

});

test('Given a message with true gyro_state when gyrophare is off then call update with increased value', async () => {
    expect.assertions(4)
    const opcClient: OpcClientMock = new OpcClientMock()
    opcClient.shouldReject = false
    opcClient.statusCode = "OK"
    opcClient.isGyroRun = false


    await processingUpdate({ "gyro_state": true }, opcClient)

    expect(opcClient.readValueCall.length).toBe(1)
    expect(opcClient.readValueCall[0]).toBe(GYROPHARE_DISPLAY_NAME)

    expect(opcClient.sendUpdateCall.length).toBe(1)
    expect(opcClient.sendUpdateCall[0]).toEqual({
        [GYROPHARE_DISPLAY_NAME]: 7
    })

});

test('Given a message with false gyro_state when gyrophare is off then call update with same value', async () => {
    expect.assertions(4)
    const opcClient: OpcClientMock = new OpcClientMock()
    opcClient.shouldReject = false
    opcClient.statusCode = "OK"
    opcClient.isGyroRun = false


    await processingUpdate({ "gyro_state": false }, opcClient)

expect(opcClient.readValueCall.length).toBe(1)
expect(opcClient.readValueCall[0]).toBe(GYROPHARE_DISPLAY_NAME)

expect(opcClient.sendUpdateCall.length).toBe(1)
expect(opcClient.sendUpdateCall[0]).toEqual({
    [GYROPHARE_DISPLAY_NAME]: 5
})

    });

test('Given a message with false gyro_state when gyrophare is on then call update with decreased value', async () => {
    expect.assertions(4)
    const opcClient: OpcClientMock = new OpcClientMock()
    opcClient.shouldReject = false
    opcClient.statusCode = "OK"
    opcClient.isGyroRun = false


    await processingUpdate({ "gyro_state": false }, opcClient)

    expect(opcClient.readValueCall.length).toBe(1)
    expect(opcClient.readValueCall[0]).toBe(GYROPHARE_DISPLAY_NAME)

    expect(opcClient.sendUpdateCall.length).toBe(1)
    expect(opcClient.sendUpdateCall[0]).toEqual({
        [GYROPHARE_DISPLAY_NAME]: 5
    })

});
})
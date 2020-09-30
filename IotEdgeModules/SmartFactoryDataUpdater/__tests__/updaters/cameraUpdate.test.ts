import cameraUpdate from "../../src/updaters/cameraUpdate"
import OpcClientMock from "../__mocks__/OpcClientMock"
import { ROBOT_NODE_NAME, PREDICTION_TAG_VALUES } from '../../src/constantes'
describe("cameraUpdate tests", () => {
    test("Given a message without prediction item then throw error", async () => {
        expect.assertions(1)
        const opcClient: OpcClientMock = new OpcClientMock()
        opcClient.shouldReject = false
        opcClient.statusCode = "OK"

        await cameraUpdate({ "random_key": 2 } as any, opcClient).catch((err) => {
            expect(err.message).toBe("Prediction property is missing")
        })
    })

    test("Given a list of prediction then should take the greatest probability and update opcua value", async () => {
        expect.assertions(2
            )
        const opcClient: OpcClientMock = new OpcClientMock()
        opcClient.shouldReject = false
        opcClient.statusCode = "OK"

        await cameraUpdate({
            predictions: [
                { tagName: "Vert", probability: 0.1 },
                {
                    probability: 0.9,
                    tagName: "Rouge"
                }]
        } as any, opcClient)

        expect(opcClient.sendUpdateCall.length).toBe(1)
        expect(opcClient.sendUpdateCall[0]).toEqual({
             [ROBOT_NODE_NAME]: PREDICTION_TAG_VALUES["Rouge"]
        })
    })

    test("Given a list of prediction for unknown tag then should throw an error", async () => {
        expect.assertions(1)
        const opcClient: OpcClientMock = new OpcClientMock()
        opcClient.shouldReject = false
        opcClient.statusCode = "OK"

        await cameraUpdate({
            predictions: [
                { tagName: "Vert", probability: 0.1 },
                {
                    probability: 0.9,
                    tagName: "BEST"
                }]
        } as any, opcClient).catch((err) => {
            expect(err.message).toBe(`No value given for prediction BEST`)
        })


    })
})
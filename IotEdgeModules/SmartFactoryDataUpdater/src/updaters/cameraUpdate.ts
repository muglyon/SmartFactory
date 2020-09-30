import { PREDICTION_TAG_VALUES, ROBOT_NODE_NAME } from "../constantes"

import { CameraMessage } from "../../types/datatype";
import { OpcClientType } from "../../types/pnType";

export default async function (message: CameraMessage, opcClient: OpcClientType) {

    if(!message.data.predictions) {
        throw new Error("Prediction property is missing")
    }

    const predictionTag = message.data.predictions.sort((a, b) => b.probability - a.probability)[0].tagName

    const opcuaValue = PREDICTION_TAG_VALUES[predictionTag]

    if(opcuaValue == undefined) {
        throw new Error(`No value given for prediction ${predictionTag}`)
    }

    await opcClient.sendUpdate({
        [ROBOT_NODE_NAME]: opcuaValue
    })
}
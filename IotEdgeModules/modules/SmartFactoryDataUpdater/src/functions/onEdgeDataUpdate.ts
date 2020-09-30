import { Message } from "azure-iot-device";
import { PROCESSING_UPDATE_NAME, CAMERA_UPDATE_NAME } from '../constantes';
import log4js from 'log4js';
import { OpcClientType } from "../../types/pnType";
import processingUpdate from "../updaters/processingUpdate";
import cameraUpdate from "../updaters/cameraUpdate";

export default async function onEdgeDataUpdate(inputName: string, msg: Message, opcClient: OpcClientType) {
    const logger = log4js.getLogger('DataUpdater');
    var message = JSON.parse(msg.getBytes().toString('utf8'));
    logger.info("NEW MESSAGE ==>", message)

    if (inputName == PROCESSING_UPDATE_NAME) {
        processingUpdate(message, opcClient)
    } 
    else if (inputName == CAMERA_UPDATE_NAME) {
        cameraUpdate(message, opcClient)
    } 
    else {
        throw new Error("Unknown input path " + inputName)
    }
}

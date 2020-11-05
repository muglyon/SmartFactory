import OpcClient from "../OPC/opcClient";
import { ModuleClient, Message } from "azure-iot-device";
import { EDGE_UPDATE_NAME, GYROPHARE_DISPLAY_NAME, GYROPHARE_BIN_PLACE } from '../constantes';
import log4js from 'log4js';
import OpcManager from "../OPC/OpcManager";

export default async function onEdgeDataUpdate(inputName: string, msg: Message, opcManager: OpcManager) {
    const logger = log4js.getLogger('DataUpdater');
    var message = JSON.parse(msg.getBytes().toString('utf8'));
    logger.info("NEW MESSAGE ==>", message)
    if (inputName == EDGE_UPDATE_NAME) {
        const gyro_state = message.gyro_state
        if (gyro_state == undefined) {
            throw new Error("gyro_state properties missing")
        }

        const actualValue: number = await opcManager.readData(GYROPHARE_DISPLAY_NAME)
        
        const binaryValue = actualValue.toString(2).padStart(6, "0")
        logger.info(actualValue + " ==> " + binaryValue)
        
        // 000010 if GYROPHARE_BIN_PLACE = 2
        //     ↑
        const bitPosition = binaryValue.length - GYROPHARE_BIN_PLACE
        let updatedValue: string;
        if (gyro_state == true) {
            updatedValue = binaryValue.substring(0, bitPosition) + "1" + binaryValue.substring(bitPosition + 1)
        } else {
            updatedValue = binaryValue.substring(0, bitPosition) + "0" + binaryValue.substring(bitPosition + 1)
        }

        logger.info("NEW VALUE ==>", updatedValue, "==> " + parseInt(updatedValue, 2))

        await opcManager.updateData({
            [GYROPHARE_DISPLAY_NAME]: parseInt(updatedValue, 2)
        })

    } else {
        throw new Error("Unknown input path " + inputName)
    }
}

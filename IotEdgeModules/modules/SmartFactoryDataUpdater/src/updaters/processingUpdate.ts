import { GYROPHARE_BIN_PLACE } from "../constantes"
import { GYROPHARE_DISPLAY_NAME } from "../constantes"
import log4js from 'log4js';
import { OpcClientType } from "../../types/pnType";

export default async function (message: any, opcClient: OpcClientType) {
    const logger = log4js.getLogger('DataUpdater');
    const gyro_state = message.gyro_state
    if (gyro_state == undefined) {
        throw new Error("gyro_state properties missing")
    }

    const actualValue: number = await opcClient.readValue(GYROPHARE_DISPLAY_NAME)

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

    await opcClient.sendUpdate({
        [GYROPHARE_DISPLAY_NAME]: parseInt(updatedValue, 2)
    })
}
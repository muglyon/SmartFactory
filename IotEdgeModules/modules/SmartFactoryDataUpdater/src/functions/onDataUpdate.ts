import { DeviceMethodResponse, DeviceMethodRequest } from "azure-iot-device";
import { HTTP_CODE_200 } from "../constantes";
import { HTTP_CODE_500 } from "../constantes";
import { HTTP_CODE_400 } from "../constantes";
import { UnknownNodeError } from "../errors/UnknownNodeError";
import log4js from 'log4js';
import OpcManager from "../OPC/OpcManager";

export default function onDataUpdate(request: DeviceMethodRequest, response: DeviceMethodResponse, opcClient: OpcManager) {
    const logger = log4js.getLogger('DataUpdater');
    const directMethodResponse = (err: Error) => {
        if (err) {
            logger.error('An error ocurred when sending a method response : ' + err.toString());
        } else {
            logger.info('Response to method \'' + request.methodName + '\' sent successfully.')
        }
    };

    opcClient.updateData(request.payload).then((res) => {
        response.send(HTTP_CODE_200, res, directMethodResponse);
    }).catch((err: Error) => {
        if(err instanceof UnknownNodeError) {
            response.send(HTTP_CODE_400, err.message, directMethodResponse)
        } else {
            response.send(HTTP_CODE_500, err.message, directMethodResponse);
        }
    });

}
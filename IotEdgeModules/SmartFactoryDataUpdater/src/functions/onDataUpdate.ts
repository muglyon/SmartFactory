import { HTTP_CODE_200, HTTP_CODE_400 } from "../constantes";
import { UnknownNodeError } from "../errors/UnknownNodeError";
import { OpcClientType } from "../../types/pnType";
import { UpdateDataType } from "../../types/datatype";
import { onDataUpdateResponse } from '../../types/onDataUpdateTypes';

export default function onDataUpdate(payload: UpdateDataType, opcClient: OpcClientType) {
    return new Promise<onDataUpdateResponse>(async (resolve, reject) => {
        await opcClient.sendUpdate(payload).then((res) => {
            resolve({
                status: HTTP_CODE_200,
                result: res
            });
        }).catch((err: Error) => {
            if (err instanceof UnknownNodeError) {
                resolve({
                    status: HTTP_CODE_400,
                    result: err.message
                });
            } else {
                reject(err);
            }
        });

    });

}
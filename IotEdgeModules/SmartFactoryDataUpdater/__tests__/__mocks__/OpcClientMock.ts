import { UpdateDataType } from "../../types/datatype";
import { UnknownNodeError } from "../../src/errors/UnknownNodeError";
import { OpcClientType } from "../../types/pnType";

export default class OpcClientMock implements OpcClientType{

    public statusCode: string;
    public shouldReject: boolean = true
    public serverError: boolean = true
    public isGyroRun: boolean = true

    public sendUpdateCall: UpdateDataType[] = []
    public readValueCall: string[] = []

    connectClient: () => void;

    sendUpdate(data: UpdateDataType) {
        this.sendUpdateCall.push(data)
        return new Promise<string>((res, rej) => {
            if (this.shouldReject) {
                if (this.serverError) {
                    rej(new Error(this.statusCode))
                }
                rej(new UnknownNodeError(this.statusCode))
            }
            res(this.statusCode)
        })
    }

    readValue(id: string) {
        this.readValueCall.push(id)
        return new Promise<any>((res, rej) => {
            if (this.shouldReject) {
                throw new Error(this.statusCode)
            } else {
                if(this.isGyroRun) {
                    res(7)
                } else {
                    res(5)
                }
            }
        })
    }
}

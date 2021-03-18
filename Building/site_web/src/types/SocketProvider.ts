import { Action } from 'redux';
import { Datas, HuileData } from './datas';


export interface BackMessage {
    body: BackBody;
    messageDate: string;
    deviceId: string;
}

export interface BackBody {
    type: string;
    data: any;
}

export interface FrontMessage {
    body: any;
    messageDate: string;
    deviceId: string;
}

export interface TimestampedData {
    timestamp: string
}

export interface TelemetryDatas extends TimestampedData {
    [sensor: string]: string | number
}

export type SocketProviderActionType = "ADD_MESSAGE";

export interface AddDataAction extends Action<SocketProviderActionType> {
    payload: Datas;
}


export interface AddHuileDataAction {
    type: "ADD_HUILE_MESSAGE"
    payload: HuileData;
}
import { UpdateDataType } from "./datatype";

export interface PnType {
    EndpointUrl: string;
    OpcNodes: OpcNode[];
}

export interface OpcNode {
    Id: string,
    OpcSamplingInterval?: number;
    OpcPublishingInterval?: number;
    DisplayName: string;
    HeartbeatInterval?: number
    SkipFirst?: boolean
}

export interface OpcClientType {
    connectClient: () => void;

    sendUpdate: (data: UpdateDataType) => Promise<string>;

    readValue: (displayName: string) => Promise<any>;

}
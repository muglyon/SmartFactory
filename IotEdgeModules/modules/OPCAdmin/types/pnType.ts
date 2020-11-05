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
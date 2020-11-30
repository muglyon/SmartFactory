import { OPCClientList } from "./OPCClientList";

export interface GetEndpointAndNodesPayload {
    nodeId : string; // The parent node id
    url: string; // URI of the OPC-UA Server
}

export interface GetEndpointAndNodesResponse {
    status: number;
    payload: any;
    newOpcClientList: OPCClientList;
}

export interface GetConfiguredNodesOnEndpointResponse {
    EndpointUrl: string;
    OpcNodes:    OpcNode[];
}

export interface OpcNode {
    Id:          string;
    DisplayName: string;
}
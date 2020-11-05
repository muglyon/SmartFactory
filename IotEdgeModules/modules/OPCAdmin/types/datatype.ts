import { Double } from "node-opcua";

export interface UpdateDataType {
    [key: string]: Double
}

export interface NodeType {
    [key: string]: ParentType | LeafType
}

export interface ParentType {
    id: string;
    childs: NodeType
}

export interface LeafType {
    id: string;
    isSubscribed: boolean
}

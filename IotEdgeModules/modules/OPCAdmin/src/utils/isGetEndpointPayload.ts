import { GetEndpointAndNodesPayload } from "../../types/directMethodsPayload";

export default function isGetEndpointPayload(message: GetEndpointAndNodesPayload): message is GetEndpointAndNodesPayload {
    return (typeof message.nodeId === "string" || !message.nodeId)
        && typeof message.url === "string"
}
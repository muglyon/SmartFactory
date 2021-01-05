import { getLogger } from "log4js";
import { GetConfiguredNodesOnEndpointResponse, GetEndpointAndNodesResponse } from "../types/directMethodsPayload";
import { OPCClientList } from "../types/OPCClientList";
import OpcClient from "./utils/OpcClient";
import { MODULE_NAME } from './constantes';

export default function getEndpointAndNodes(url: string, nodeId: string, opcConfig: GetConfiguredNodesOnEndpointResponse, opcClientList: OPCClientList) {
    return new Promise<GetEndpointAndNodesResponse>((resolve, reject) => {
        const logger = getLogger(MODULE_NAME);
        logger.info("getEndpointAndNodes called.");
        let opcClient: OpcClient;

        if (!Object.keys(opcClientList).includes(url)) {
            opcClient = new OpcClient(url);
            opcClientList[url] = opcClient;
        } else {
            opcClient = opcClientList[url];
        }

        opcClient.getServerNode(opcConfig.OpcNodes, nodeId)
            .then((getServerNodeRes) => {
                logger.info("getEndpointAndNodes sucess response.");
                resolve({
                    status: 200,
                    payload: getServerNodeRes,
                    newOpcClientList: opcClientList
                });
            }).catch((err) => {
                logger.warn("getEndpointAndNodes failed response.");
                reject(err);
            });
    });
}
import { ModuleClient } from 'azure-iot-device';
import { GetEndpointAndNodesPayload } from '../../types/directMethodsPayload';
import { GET_NODES_METHOD } from '../constantes';
import { getLogger } from 'log4js'
import isGetEndpointPayload from '../../src/utils/isGetEndpointPayload';
import { OPCClientList } from '../../types/OPCClientList';
import { MODULE_NAME } from '../constantes';
import getEndpointAndNodes from '../../src/getEndpointAndNodes';
import { MethodParams } from 'azure-iot-device/dist/device_method';

export default class DirectMethods {

    private client: ModuleClient;
    private opcClientList: OPCClientList = {};
    private logger = getLogger(MODULE_NAME);

    constructor(client: ModuleClient) {
        this.client = client;
        
        this.client.onMethod(GET_NODES_METHOD, async (request, response) => {
            if (isGetEndpointPayload(request.payload)) {
                const payload: GetEndpointAndNodesPayload = request.payload;
                const endpointConfig = await this.getEndpointConfig(this.client, payload.url)
                    .catch((err) => {
                        response.send(500, err);
                    });

                if (endpointConfig) {
                    if (endpointConfig.status === 200) {
                        const getEndpointAndNodesResponse = await getEndpointAndNodes(payload.url, request.payload.nodeId, endpointConfig.payload, this.opcClientList)
                            .catch((err: Error) => {
                                this.logger.error("Erreur lors de la fonction " + GET_NODES_METHOD);
                                this.logger.error(err);
                                response.send(500, err);
                            });
                        if (getEndpointAndNodesResponse) {
                            this.opcClientList = getEndpointAndNodesResponse.newOpcClientList;
                            response.send(getEndpointAndNodesResponse.status, getEndpointAndNodesResponse.payload);
                        }
                    } else {
                        response.send(endpointConfig.status, endpointConfig);
                    }
                }
            } else {
                response.send(400, 'Le payload que vous avez envoyé est mal formé. Vous devez envoyer un nodeId (optionel) et une url (opc.tcp://).')
            }

        });
    }

    async getEndpointConfig(client: ModuleClient, url: string) {
        if (process.env.NODE_ENV !== 'production') {
            this.logger.info("Cette méthode dépend de l'environnement IoTEdge.");
            this.logger.info("Pour tester cette méthode vous devez l'installer sur un environnement IoTEdge.");
        }
        const deviceId = process.env.IOTEDGE_DEVICEID;
        const payload: MethodParams = {
            methodName: "GetConfiguredNodesOnEndpoint",
            payload: { "EndpointUrl": url },
            connectTimeoutInSeconds: 10,
            responseTimeoutInSeconds: 10
        };
        return await client.invokeMethod(deviceId, "OPCPublisher", payload).catch((err) => {
            this.logger.error("Erreur lors de la récupération des endpoints configuré.");
            this.logger.error(err);
            return err;
        });
    }

}

import { ModuleClient, DeviceMethodRequest, DeviceMethodResponse } from 'azure-iot-device';

import { GET_NODES_METHOD } from '../constantes';
import OpcClient from '../utils/OpcClient';
import { MethodParams } from 'azure-iot-device/lib/device_method';
import { getLogger } from 'log4js'

export default class DirectMethods {

    private client: ModuleClient;
    private opcClientList: { [url: string]: OpcClient }
    private logger = getLogger('OPCAdmin');

    constructor(client: ModuleClient) {
        this.client = client;
        this.opcClientList = {};
        
        this.client.onMethod(GET_NODES_METHOD, (request, response ) => this.getEndpointAndNodes(request, response));
    }

    getEndpointAndNodes(request: DeviceMethodRequest, response: DeviceMethodResponse) {
        this.logger.info("getEndpointAndNodes called.");
        const url = request.payload.url;
        const nodeId: string | undefined = request.payload.nodeId;
        let opcClient: OpcClient;
        
        if (!Object.keys(this.opcClientList).includes(url)) {
            opcClient = new OpcClient(url);
            this.opcClientList[url] = opcClient;
        } else {
            opcClient = this.opcClientList[url];
        }

        this.getEndpointConfig(this.client, url).then(
            (opcConfig) => {
                if (opcConfig.status != 200) {
                    response.send(opcConfig.status, opcConfig.payload);
                } else {
                    opcClient.getServerNode(opcConfig.payload.OpcNodes, nodeId).then((res) => {
                        this.logger.info("getEndpointAndNodes sucess response.")
                        response.send(200, res);
                    }).catch((err) => {
                        this.logger.warn("getEndpointAndNodes failed response.")
                        response.send(500, err);
                    });
                }
            }
        ).catch((err) => {
            this.logger.warn("getEndpointAndNodes failed response.")
            response.send(500, err);
        });
    }

    getEndpointConfig(client: ModuleClient, url: string) {
        
        const deviceId = process.env.IOTEDGE_DEVICEID;
        const payload: MethodParams = {
            methodName: "GetConfiguredNodesOnEndpoint",
            payload: { "EndpointUrl": url },
            connectTimeoutInSeconds: 10,
            responseTimeoutInSeconds: 10
        };
        return client.invokeMethod(deviceId, "OPCPublisher", payload);
    }

}

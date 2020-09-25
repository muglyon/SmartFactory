import { OPCUAServer, Variant, OPCUACertificateManager, DataValue, UAVariable, StatusCodes, StatusCode, StatusCodeCallback } from 'node-opcua';
import paths from '../path.json';
import { MessageType } from '../types/messageType';

class OpcServer {
    private hostname: string;
    private server: OPCUAServer;
    private actualData: MessageType = {};

    constructor() {
        this.hostname = "opc.tcp://localhost:49321"
    }

    async sessionInit(initData: MessageType) {
        this.server = new OPCUAServer({
            port: 49321, // the port of the listening socket of the server
            resourcePath: "/",
            serverCertificateManager: new OPCUACertificateManager({
                automaticallyAcceptUnknownCertificate: true
            })
        });
        this.actualData = initData;
        await this.server.initialize();

        const addressSpace = this.server.engine.addressSpace;
        const namespace = addressSpace.getOwnNamespace();

        // declare a new object
        const device = namespace.addObject({
            organizedBy: addressSpace.rootFolder.objects,
            browseName: "DB701"
        });

        Object.keys(paths).forEach((key) => {
            if (key != "hour") {
                namespace.addVariable({
                    componentOf: device,
                    browseName: key,
                    dataType: paths[key].type,
                    nodeId: paths[key].address,

                    value: {
                        timestamped_get: () => {
                            return new DataValue({
                                value: new Variant({ dataType: paths[key].type, value: this.actualData[key] }),
                                sourceTimestamp: new Date(this.actualData["hour"]),
                                sourcePicoseconds: 0
                            });
                        },
                        timestamped_set: (dataValue: DataValue, callback: StatusCodeCallback) => {
                            this.actualData[key] = dataValue.value.value
                            callback(null, StatusCodes.Good)
                        }
                    }
                });
            }

        })

        this.server.start(() => {
            console.log("Server is now listening ... ( press CTRL+C to stop)");
            console.log("port ", this.server.endpoints[0].port);
            const endpointUrl = this.server.endpoints[0].endpointDescriptions()[0].endpointUrl;
            console.log(" the primary server endpoint url is ", endpointUrl);
        });
    }

    sendUpdate(newData: MessageType) {
        this.actualData = newData;
    }
}
export default OpcServer;
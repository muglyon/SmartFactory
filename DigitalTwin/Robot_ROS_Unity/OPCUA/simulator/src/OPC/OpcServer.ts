import { OPCUAServer, Variant, OPCUACertificateManager, DataValue, StatusCodes, StatusCodeCallback, MessageSecurityMode, SecurityPolicy, DataType } from 'node-opcua';
import paths from '../path.json';
import { Datas } from '../types/messageType';

class OpcServer {
    public hostname: string;
    private server: OPCUAServer;
    private actualData: Datas;

    constructor() { }

    sessionInit(initData: Datas) {
        return new Promise<void>(async (resolve, reject) => {
            this.server = new OPCUAServer({
                port: 49321, // the port of the listening socket of the server
                resourcePath: "/",
                allowAnonymous: true,
                securityModes: [MessageSecurityMode.None],
                securityPolicies: [SecurityPolicy.None],
                serverCertificateManager: new OPCUACertificateManager({
                    automaticallyAcceptUnknownCertificate: true
                }),
                userManager: {
                    isValidUser: (username: string, password: string) => true 
                }
            });
            this.actualData = initData;
            await this.server.initialize();

            const addressSpace = this.server.engine.addressSpace;
            const namespace = addressSpace.getOwnNamespace();

            // declare a new object
            const device = namespace.addObject({
                organizedBy: addressSpace.rootFolder.objects,
                browseName: "Nyrio"
            });

            Object.keys(paths).forEach((key) => {
                if (key != "hour") {
                    namespace.addVariable({
                        componentOf: device,
                        browseName: key,
                        dataType: DataType[paths[key].type],
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
                                console.log("Data updated", this.actualData)
                                callback(null, StatusCodes.Good)
                            },
                            
                        }
                    });
                }

            })

            this.server.start(() => {
                console.log("Server is now listening ... ( press CTRL+C to stop)");
                console.log("port ", this.server.endpoints[0].port);
                const endpointUrl = this.server.endpoints[0].endpointDescriptions()[0].endpointUrl;
                this.hostname = endpointUrl;
                console.log(" the primary server endpoint url is ", endpointUrl);
                resolve();
            });

            this.server.on("connectionRefused", () => { console.log("NEW SESSION") })
        });

    }

    sendUpdate(newData: Datas) {
        this.actualData = newData;
    }
}
export default OpcServer;
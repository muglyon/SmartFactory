import { MessageSecurityMode, SecurityPolicy, OPCUAClient, ClientSession, Variant, OPCUAClientOptions, coerceNodeId, DataValue } from 'node-opcua';
import fs from 'fs';
import { PnType, OpcNode, OpcClientType } from '../../types/pnType';
import { UpdateDataType } from '../../types/datatype';
import { MODULE_NAME } from '../constantes';
import { CONFIG_PATH } from '../constantes';
import { UnknownNodeError } from '../errors/UnknownNodeError';
import { getLogger } from 'log4js';

const logger = getLogger('DataUpdater')
class OpcClient implements OpcClientType {
    private hostname: string;
    private nodes: OpcNode[];
    private session: ClientSession;
    private client: OPCUAClient;
    private isConnected = false;

    constructor(config: PnType = null) {

        if (!config) {
            const rawdata = fs.readFileSync(CONFIG_PATH);
            const options: PnType[] = JSON.parse(rawdata.toString());
            this.hostname = options[0].EndpointUrl
            this.nodes = options[0].OpcNodes
        } else {
            this.hostname = config.EndpointUrl,
            this.nodes = config.OpcNodes
        }

        const connectOptions: OPCUAClientOptions = {
            applicationName: MODULE_NAME,
            connectionStrategy: {
                initialDelay: 1000,
                maxRetry: 15
            },
            securityMode: MessageSecurityMode.None,
            securityPolicy: SecurityPolicy.None,
            endpoint_must_exist: false
        };

        this.client = OPCUAClient.create(connectOptions);
    }

    async connectClient() {
        if (!this.isConnected) {
            logger.log(this.hostname)
            await this.client.connect(this.hostname).catch((err) => {
                logger.error(`Connection to the OPC-UA server impossible.`,);
                logger.error("OPC-UA connexion error ==> ", err);
                throw err;
            });

            if (this.client) {
                this.isConnected = true;

                this.session = await this.client.createSession().catch((err) => {
                    logger.error(`Error during the creation of the OPC-UA session.`);
                    throw err;
                });
            }
        }
    }

    sendUpdate(data: UpdateDataType): Promise<string> {

        return new Promise<string>(async (resolve, reject) => {
            this.connectClient().then(async () => {
                if (this.session) {
                    const key = Object.keys(data)[0];
                    const node = this.nodes.find(x => x.DisplayName == key)
                    if (node) {
                        const nodeId = coerceNodeId(node.Id)
                        const dataType = await this.session.getBuiltInDataType(nodeId)
                            .catch((err) => {
                                logger.error("Error when you try to get the node: " + nodeId);
                                logger.error(err);
                                reject(err);
                            })
                        if (dataType) {
                            const statusCode = await this.session.writeSingleNode(nodeId, new Variant({
                                dataType,
                                value: data[key]
                            })).catch((err) => {
                                logger.error("Error during the write of the node: " + nodeId);
                                logger.error(err);
                                reject(err);
                            });

                            if (statusCode) {
                                resolve(statusCode.name)
                            }
                        } else {
                            reject(new Error("Unable to get the datatype of the node with nodeid " + nodeId));
                        }
                    }
                    const allDisplayNames = this.nodes.map((node) => node.DisplayName);
                    reject(new UnknownNodeError(`Unknown node -> ' + ${key} List of availables node displayName ${allDisplayNames}`));
                } else {
                    reject(new Error("Connexion uninitialized..."))
                }
            });
        });
    }

    readValue(displayName: string): Promise<any> {
        return new Promise<any>(async (res, rej) => {
            this.connectClient().then(async () => {
                const node = this.nodes.find(x => x.DisplayName == displayName)
                if (node) {
                    const id = node.Id

                    const datavalue: DataValue = await this.session.readVariableValue(id)
                    res(datavalue.value.value)
                }
                else {
                    rej(new Error("Unknown DisplayName ==> " + displayName))
                }
            })
        })
    }

}
export default OpcClient;
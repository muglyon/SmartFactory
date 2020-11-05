import { MessageSecurityMode, SecurityPolicy, OPCUAClient, ClientSession, DataType, Variant, OPCUAClientOptions, coerceNodeId, DataValue } from 'node-opcua';
import { PnType, OpcNode, OpcClientType } from '../../types/pnType';
import { UpdateDataType } from '../../types/datatype';
import { MODULE_NAME } from '../constantes';
import { UnknownNodeError } from '../errors/UnknownNodeError';
import { getLogger } from 'log4js';

const logger = getLogger('DataUpdater')
class OpcClient implements OpcClientType {
    public hostname: string;
    public nodes: OpcNode[];
    private session: ClientSession;
    private client: OPCUAClient;
    private isConnected = false;

    constructor(config: PnType) {
        this.hostname = config.EndpointUrl
        this.nodes = config.OpcNodes


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

    containNode(id: string) {
        return this.nodes.some((node) => node.DisplayName == id)
    }

    updateNodes(nodes: OpcNode[]) {
        this.nodes = nodes
    }

    async connectClient() {
        if (!this.isConnected) {
            logger.log(this.hostname)
            await this.client.connect(this.hostname).catch((err) => {
                logger.error(`Impossible de se connecter au client OPCUA.`,);
                logger.error("OPC-UA connexion error ==> ", err);
                throw err;
            });

            if (this.client) {
                this.isConnected = true;

                this.session = await this.client.createSession().catch((err) => {
                    logger.error(`Impossible de créer la session OPC-UA`);
                    throw err;
                });
            }
        }
    }

    sendUpdate(data: UpdateDataType): Promise<string> {

        return new Promise<string>(async (res, rej) => {
            this.connectClient().then(async () => {
                if (this.session) {
                    const key = Object.keys(data)[0];
                    const node = this.nodes.find(x => x.DisplayName == key)
                    if (node) {
                        const nodeId = coerceNodeId(node.Id)
                        const dataType = await this.session.getBuiltInDataType(nodeId)
                            .catch((err) => {
                                logger.error("Erreur lors de la récupération du type du noeud " + nodeId);
                                logger.error(err);
                                rej(err);
                            })
                        logger.log(dataType)
                        const statusCode = await this.session.writeSingleNode(node.Id, {
                            dataType: dataType,
                            value: data[key]
                        } as Variant).catch((err) => {
                            logger.error("Erreur lors de l'écriture du noeud " + node.Id);
                            logger.error(err);
                            rej(err);
                        });

                        if (statusCode) {
                            logger.info("status code ==>", statusCode);

                            res(statusCode.name)
                        }
                    }
                    rej(new UnknownNodeError('Unknown node -> ' + key))
                } else {
                    rej(new Error("Aucune connexion initialisée"))
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
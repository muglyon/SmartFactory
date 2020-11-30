import { MessageSecurityMode, SecurityPolicy, OPCUAClient, ClientSession, NodeClass } from 'node-opcua';
import { OpcNode } from '../../types/pnType';
import { NodeType, LeafType, ParentType } from '../../types/datatype';
import { MODULE_NAME, ROOT_OPC_FOLDER } from '../constantes';
import { getLogger } from 'log4js'

class OpcClient {
    public hostname: string;
    private client: OPCUAClient;
    private isConnected = false;
    private session: ClientSession;
    private logger = getLogger(MODULE_NAME);

    constructor(url: string) {

        this.hostname = url;

        const connectOptions = {
            applicationName: MODULE_NAME,
            connectionStrategy: {
                initialDelay: 1000,
                maxRetry: 1
            },
            securityMode: MessageSecurityMode.None,
            securityPolicy: SecurityPolicy.None,
            endpoint_must_exist: false
        };

        this.client = OPCUAClient.create(connectOptions);
    }

    async connectClient() {
        if (!this.isConnected) {
            await this.client.connect(this.hostname).catch((err) => {
                this.logger.error(`Impossible de se connecter au client OPCUA. Serveur : ${this.hostname}`,);
                this.logger.error("OPC-UA connexion error ==> ", err);

                if (process.env.NODE_ENV !== 'production') {
                    this.logger.info("Vous avez besoin d'un serveur OPC-UA disponible à l'adresse " + this.hostname + " pour tester cette méthode.");
                    this.logger.info("Pour ça vous pouvez installer un serveur OPC-UA Kepware en téléchargeant le logiciel adéquat à l'adresse https://www.kepware.com/en-us/content-gates/ex-demo-download-content-gate/?product=d2239b8c-36f2-4d07-8fbd-e223d0e26bbf&gate=8a5e8dd5-6edf-4d68-aa36-72f97b11e612");
                }

                throw err;
            });

            if (this.client) {
                this.isConnected = true;

                this.session = await this.client.createSession().catch((err) => {
                    console.error(`Impossible de créer la session OPC-UA`);
                    throw err;
                });
            }
        }
    }

    public async getServerNode(subscribedNodes: OpcNode[], folderId?: string) {
        return new Promise<NodeType>((resolve, reject) => {
            this.connectClient()
                .then(async () => {
                    console.log('folderId  ==>', folderId);
                    const getIdNodesChildrenResponse = await this.getIdNodesChildren(folderId ? folderId : ROOT_OPC_FOLDER, subscribedNodes)
                        .catch((err) => {
                            reject(err);
                        })
                    if (getIdNodesChildrenResponse) {
                        resolve(getIdNodesChildrenResponse);
                    }
                })
                .catch((err) => {
                    console.error("Erreur lors de la récupération des noeuds du serveurs ", err);
                    console.error("subscribedNodes : ", subscribedNodes);
                    console.error("folderId : ", folderId);
                    reject(err);
                });
        });
    }

    public async getIdNodesChildren(id: string, alreadySubscribedNodes: OpcNode[]): Promise<NodeType> {
        return this.session.browse(id).then(
            async (browseResult) => {
                const result: { [key: string]: LeafType | ParentType } = {};

                for (let ref of browseResult.references) {

                    const completeName = ref.nodeId.toString().split('=').slice(-1)[0]; // ns=2;s=item.toto.id => item.toto.id

                    const splittedId = completeName.split('.');
                    const name = splittedId[splittedId.length - 1]; // item.toto.id => id

                    const isMetaNode = this.checkStringBeginWithUnderscoreOrNumber(name);
                    if (!isMetaNode) {
                        if (ref.nodeClass == NodeClass.Variable) {
                            const isSubscribed = alreadySubscribedNodes.findIndex((x) => x.Id === ref.nodeId.toString()) !== -1
                            const leaf: LeafType = {
                                id: ref.nodeId.toString(),
                                isSubscribed
                            };
                            result[name] = leaf;
                        } else {
                            const parent: ParentType = {
                                id: ref.nodeId.toString(),
                                childs: {}
                            };
                            result[name] = parent;
                        }
                    }

                }
                return result
            });
    }

    private checkStringBeginWithUnderscoreOrNumber(str: string) {
        return /[_]/.test(str[0])
    }
}

export default OpcClient;

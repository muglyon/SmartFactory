import { MessageSecurityMode, SecurityPolicy, OPCUAClient, ClientSession, NodeClass } from 'node-opcua';
import { OpcNode } from '../../types/pnType';
import { NodeType, LeafType, ParentType } from '../../types/datatype';
import { MODULE_NAME, ROOT_OPC_FOLDER } from '../constantes';

class OpcClient {
    public hostname: string;
    private client: OPCUAClient;
    private isConnected = false;
    private session: ClientSession;

    constructor(url: string) {

        this.hostname = url

        const connectOptions = {
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
            console.log(this.hostname)
            await this.client.connect(this.hostname).catch((err) => {
                console.error(`Impossible de se connecter au client OPCUA.`,);
                console.error("OPC-UA connexion error ==> ", err);
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
        return this.connectClient().then(() => {
            return this.getIdNodesChildren(folderId ? folderId : ROOT_OPC_FOLDER, subscribedNodes)
        }).catch((err: Error) => {
            console.error("Erreur lors de la récupération des noeuds du serveurs ", err);
            console.error("subscribedNodes : ", subscribedNodes);
            console.error("folderId : ", folderId);
        });
    }

    public getIdNodesChildren(id: string, alreadySubscribedNodes: OpcNode[]): Promise<NodeType> {
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
        return /[0-9_]/.test(str[0])
    }
}

export default OpcClient;

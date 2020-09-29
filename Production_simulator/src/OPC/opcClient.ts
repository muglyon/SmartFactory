import {
    MessageSecurityMode,
    SecurityPolicy,
    OPCUAClient,
    ClientSession,
    OPCUAClientOptions,
    ClientSubscription,
    AttributeIds,
    ClientMonitoredItemBase,
    TimestampsToReturn,
    resolveNodeId,
    DataType,
    Variant
} from 'node-opcua';
import config from '../config.json'

class OpcClient {
    private session: ClientSession;
    private client: OPCUAClient;
    private isConnected = false;
    public subscription: ClientSubscription;

    constructor() {
        const connectOptions: OPCUAClientOptions = {
            applicationName: "SmartFactory",
            connectionStrategy: {
                initialDelay: 10,
                maxRetry: 15
            },
            securityMode: MessageSecurityMode.None,
            securityPolicy: SecurityPolicy.None,
            endpoint_must_exist: false,

        };

        this.client = OPCUAClient.create(connectOptions);
    }

    /**
     * Connect your client to a given server.
     * @param hostname The hostname of your OPC-UA server @example "opc.tcp://localhost:4334/UA/SmartFactory"
     */
    async connectClient(hostname: string) {
        if (!this.isConnected) {
            await this.client.connect(hostname).catch((err) => {
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

                this.subscription = await this.session.createSubscription2({
                    requestedPublishingInterval: 500,
                    requestedLifetimeCount: 10,
                    requestedMaxKeepAliveCount: 5,
                    maxNotificationsPerPublish: 10,
                    publishingEnabled: true,
                    priority: 1
                })

                this.subscription.on("started", function () {
                    console.log("subscription started - subscriptionId=", this.subscription.subscriptionId);
                }).on("terminated", function () {
                    console.log("terminated")
                });
            }
        }
    }

    /**
     * Return a monitor object for a given nodeId
     * @param nodeId The id of the node you want to monitor @example "ns=1;i=1001"
     */
    async getNodeMonitor(nodeId: string): Promise<ClientMonitoredItemBase> {
        return this.subscription.monitor({
            nodeId: resolveNodeId(nodeId),
            attributeId: AttributeIds.Value
        },
            {
                samplingInterval: 250,
                discardOldest: true,
                queueSize: 1
            },
            TimestampsToReturn.Both)
    }

    modifyNode(nodeId: string, value: number) {
        return this.session.writeSingleNode(nodeId, new Variant({
            value, dataType: DataType.Double
        }));
    }

}


export default OpcClient;
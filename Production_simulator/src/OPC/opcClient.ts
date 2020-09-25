import { MessageSecurityMode, SecurityPolicy, OPCUAClient, ClientSession, DataType, Variant, OPCUAClientOptions, coerceNodeId, DataValue, ClientSubscription, AttributeIds, MonitoredItem, ClientMonitoredItemBase, TimestampsToReturn, resolveNodeId } from 'node-opcua';
import config from '../config.json'

class OpcClient {
    private hostname: string;
    private session: ClientSession;
    private client: OPCUAClient;
    private isConnected = false;
    public subscription: ClientSubscription;
    constructor() {


        const connectOptions: OPCUAClientOptions = {
            applicationName: "Simulateur",
            connectionStrategy: {
                initialDelay: 1000,
                maxRetry: 15
            },
            securityMode: MessageSecurityMode.None,
            securityPolicy: SecurityPolicy.None,
            endpoint_must_exist: false
        };

        this.client = OPCUAClient.create(connectOptions);
        this.hostname = config.kepwareHostname
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

    async getNodeMonitor(nodeId: string): Promise<ClientMonitoredItemBase> {
        console.log(nodeId)
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
}


export default OpcClient;
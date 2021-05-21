import { DigitalTwinsClient } from "@azure/digital-twins-core";
import { ClientSecretCredential } from "@azure/identity";
import { Observable, Subscriber } from 'rxjs';

export default class DigitalTwinsSingleton {

    private static instance: DigitalTwinsSingleton;

    private service: DigitalTwinsClient
    isInitialized: boolean = false;
    private twinIdList: string[] = [];
    dataObservable: Observable<{ [key: string]: any }>;
    private subscriber: Subscriber<{ [key: string]: any }>;

    private constructor() {

    }

    init(endpointUrl: string, tenantId?: string, clientId?: string, clientSecret?: string) {
        if (!tenantId) {
            tenantId = process.env.TENANT_ID
        }
        if (!clientId) {
            clientId = process.env.CLIENT_ID
        }
        if (!clientSecret) {
            clientSecret = process.env.CLIENT_SECRET
        }
        if (!tenantId || !clientId || !clientSecret) {
            console.error(`Missing configuration -- TenantId : ${tenantId} -- ClientID : ${clientId} -- ClientSecret : ${clientSecret}`)
        } else {
            const credentials = new ClientSecretCredential(tenantId, clientId, clientSecret)
            this.service = new DigitalTwinsClient(endpointUrl, credentials)
            this.isInitialized = true;

            this.dataObservable = new Observable(subscriber => { this.subscriber = subscriber })
            setInterval(() => { this.getAllTwinsData() }, 1000)
        }
    }

    static getInstance() {
        if (!DigitalTwinsSingleton.instance) {
            DigitalTwinsSingleton.instance = new DigitalTwinsSingleton();
        }
        return DigitalTwinsSingleton.instance;
    }

    addTwinId(twinId: string) {
        if (!this.twinIdList.includes(twinId)) {
            this.twinIdList.push(twinId)
        }
    }

    private async getAllTwinsData() {
        if (this.isInitialized) {
            const datas: any[] = [];

            const forbiddenKeys = ["$metadata", "$etag"]
            for (const twinId of this.twinIdList) {
                const data = await this.service.getDigitalTwin(twinId)
                // datas.push(data.body)

                const filteredData = Object.keys(data.body)
                    .filter(key => !forbiddenKeys.includes(key))
                    .reduce((obj, key) => {
                        obj[key] = data.body[key];
                        return obj;
                    }, {});

                datas.push(filteredData)
            }
            this.sendToSubscriber(this.formatToFront(datas))
        }

    }

    private formatToFront(datas: any[]) {
        const items = {}
        for (const data of datas) {
            const id = data["$dtId"]
            items[id] = { ...data }
            delete items[id]["$dtId"]
        }

        return items
    }

    private sendToSubscriber(datas: { [key: string]: any }) {
        this.subscriber.next(datas)
    }
}
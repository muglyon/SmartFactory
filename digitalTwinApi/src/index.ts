import { DigitalTwinsClient } from "@azure/digital-twins-core";
import { ClientSecretCredential } from "@azure/identity";
import { Instance } from "../types/instanceType";
import { ModelList } from "../types/modelType";
import { RelationshipDefinition } from "../types/relationshipType";
import createInstances from "./twins/createInstances";
import createRelationships from "./twins/createRelationships";
import pushModels from "./twins/pushModels";
import { csvLoaderFolder, csvLoader } from "./parser/csvLoader";
import { jsonLoaderFolder } from "./parser/jsonLoader";
import jsonPatcher from "./parser/jsonPatch";

export default class DigitalTwinsApi {

    service: DigitalTwinsClient
    constructor(uri: string, tenantId?: string, clientId?: string, clientSecret?: string) {
        if (!tenantId) {
            tenantId = process.env.AZURE_TENANT_ID
        }
        if (!clientId) {
            clientId = process.env.AZURE_CLIENT_ID
        }
        if (!clientSecret) {
            clientSecret = process.env.AZURE_CLIENT_SECRET
        }
        if (!tenantId || !clientId || !clientSecret) {
            console.error(`Missing configuration -- TenantId : ${tenantId} -- ClientID : ${clientId} -- ClientSecret : ${clientSecret}`)
        }
        const credentials = new ClientSecretCredential(tenantId, clientId, clientSecret)
        this.service = new DigitalTwinsClient(uri, credentials)
    }

    getModels() {
        return this.service.listModels()
    }

    pushModels(models: ModelList) {
        return pushModels(this.service, models)
    }

    async pushModelsFolder(folder: string) {
        const models = await jsonLoaderFolder(folder)
        return pushModels(this.service, models)
    }

    createInstances(instances: Instance[]) {
        return createInstances(this.service, instances)
    }

    async createInstancesFile(path: string) {
        const items = await csvLoader(path)

        return createInstances(this.service, items)
    }

    async createInstancesFolder(folder: string) {
        const items = await csvLoaderFolder(folder)
        // console.log(items)
        return createInstances(this.service, items)
    }

    createRelationships(relationships: RelationshipDefinition[]) {
        return createRelationships(this.service, relationships)
    }


    async createRelationshipsFile(path: string) {
        const items = await csvLoader<RelationshipDefinition>(path)
        return createRelationships(this.service, items)
    }


    async createRelationshipsFolder(folder: string) {
        const items = await csvLoaderFolder<RelationshipDefinition>(folder)
        return createRelationships(this.service, items)
    }

    updateTwin(id: string, data: { [key: string]: any }) {
        const jsonPatch = jsonPatcher(data)
        return this.service.updateDigitalTwin(id, jsonPatch)
    }
}
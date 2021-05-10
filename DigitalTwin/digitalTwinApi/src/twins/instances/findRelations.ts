import { DigitalTwinsClient, IncomingRelationship } from "@azure/digital-twins-core";

export default async function findRelationsIds(service: DigitalTwinsClient, id: string, relationName?: string) {
    const relations = await service.listIncomingRelationships(id)
    const result: string[] = []
    for await (const relation of relations) {
        if (!relationName || relation.relationshipName == relationName) {
            result.push(relation.sourceId)
        }
    }
    return result
}
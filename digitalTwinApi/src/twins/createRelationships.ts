import { DigitalTwinsClient } from "@azure/digital-twins-core";
import { RelationshipDefinition, RelationshipObject } from "../../types/relationshipType";

import getErrorMessage from "../utils/getErrorMessage";

export default async function createRelationships(service: DigitalTwinsClient, items: RelationshipDefinition[]) {
    let errorList = []
    await Promise.all(items.map((item) => {
        const { source, name, target, ...properties } = item

        Object.keys(properties).forEach(key => properties[key] === undefined && delete properties[key])

        const relationship: RelationshipObject = {
            $relationshipId: `${source}-${name}-${target}`,
            $sourceId: source,
            $relationshipName: name,
            $targetId: target,
            ...properties
        }

        return service.upsertRelationship(
            relationship["$sourceId"],
            relationship["$relationshipId"],
            relationship
        ).catch((err) => { errorList.push(`relationship for ${source} --> ${getErrorMessage(err)}`) })
    }))

    return errorList
}
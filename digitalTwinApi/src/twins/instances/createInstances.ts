import { DigitalTwinsClient } from "@azure/digital-twins-core";
import { ModelContent, ModelContentList } from "../../types/modelType";
import csvDataParser from "../../parser/csvDataParser";
import { v4 } from 'uuid'
import { Instance } from "../../types/instanceType";
import { RelationshipDefinition } from "../../types/relationshipType";
import createRelationships from "../relationships/createRelationships";
import getErrorMessage from "../../utils/getErrorMessage";

export default async function createInstances(service: DigitalTwinsClient, items: Instance[]) {
    return new Promise<string[]>(async (res, rej) => {
        const relationships: RelationshipDefinition[] = []
        const existingModels: ModelContentList = {}
        const listError = []
        const itemsCopy = JSON.parse(JSON.stringify(items))
        await Promise.all(
            itemsCopy.map(async (item) => {

                if (!item.model || !item.Id) {
                    listError.push(`Id ou modele manquant pour l'instance ${JSON.stringify(item)}`)
                } else {
                    const id = item.Id
                    const modelName = item.model
                    await getModelContents(service, existingModels, modelName)
                        .then((model) => {
                            delete item.Id
                            delete item.model

                            const parsedItem = csvDataParser(item)
                            Object.keys(parsedItem).forEach((key) => {
                                const definition = model.find((x) => x.name == key)
                                if (!definition) {
                                    // listError.push(`La propriété ${key} n'existe pas dans le modèle ${modelName}. Propriété supprimée`)
                                    delete parsedItem[key]
                                } else {
                                    if (definition["@type"] == "Relationship") {
                                        relationships.push({
                                            name: key,
                                            source: id,
                                            target: parsedItem[key]
                                        })
                                        delete parsedItem[key]
                                    }
                                    else if (definition["@type"] == "Component") {
                                        parsedItem[key]["$metadata"] = {}
                                    }
                                }

                            })
                            if (model) {

                                service.upsertDigitalTwin(id, {
                                    $metadata: {
                                        $model: modelName
                                    },
                                    ...parsedItem
                                } as any).catch((err) => {
                                    listError.push(`id: ${id} --> ${getErrorMessage(err)}`)
                                })
                            }
                        })
                        .catch((err) => {  listError.push(getErrorMessage(err)) })


                }
            })).catch((err) => listError.push(getErrorMessage(err)))


        await createRelationships(service, relationships)
            .then((messageList) => listError.push(...messageList))
            .catch((err) => listError.push(getErrorMessage(err)))
        res(listError)
    })

}

// recursively load digital twins models and extensions
// add data in modelList parameter
export async function getModelContents(service: DigitalTwinsClient, modelList: ModelContentList, id: string) {
    if (id in modelList) {
        return modelList[id]
    } else {
        // console.log(service, service.getModel)
        const fullModel = await service.getModel(id, true)
        let model: ModelContent[] = fullModel.model.contents ? fullModel.model.contents : []
        if (fullModel.model.extends) {
            const extendsModel = await Promise.all<ModelContent[]>(fullModel.model.extends.map(async (x) => await getModelContents(service, modelList, x)))
            model = model.concat(...extendsModel)
        }

        modelList[id] = model
        return model;
    }
}
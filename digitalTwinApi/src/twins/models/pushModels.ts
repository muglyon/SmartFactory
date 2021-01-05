import { DigitalTwinsClient } from "@azure/digital-twins-core";
import { Model, ModelList } from "../../types/modelType";

export default async function pushModels(service: DigitalTwinsClient, models: ModelList): Promise<string[]> {
    
    const modelsCopy = Object.assign({}, models)
    const dependencies = await createDependencies(Object.values(modelsCopy))
    const existingModels = []
    for await (const model of service.listModels()) {
        existingModels.push(model.id)
    }
    const listMessages = []

    while (Object.keys(modelsCopy).length > 0) {
        const id = Object.keys(modelsCopy).find((value) => dependencies[value] == [] || dependencies[value].every((x) => existingModels.includes(x)))

        if (!id) {
            listMessages.push(`Les modeles ${Object.keys(modelsCopy).join(', ')} possèdent des dépendances inconnues`)
            break;
        }

        const model = modelsCopy[id]
        if (existingModels.includes(id)) {
            listMessages.push(`Le modele ${id} existe déjà. Import annulé`)
        } else {
            const result = await service.createModels([model])
            if(result._response.status == 201){
                existingModels.push(id)
                listMessages.push(`Modele ${id} créé`)
            } else {
                listMessages.push(`Erreur lors de la création du modèle ${id} : ${result._response.bodyAsText}`)
            }
        }

        delete modelsCopy[id]
    }

    return listMessages
}

async function createDependencies(models: Model[]) {
    const dep: { [key: string]: string[] } = {}
    models.forEach((model) => {
        dep[model["@id"]] = []

        if(model.contents) {
            model.contents.forEach((content) => {
                if (content["@type"] == "Relationship" && content.target) {
                    dep[model["@id"]].push(content.target)
                } else if (content["@type"] == "Component") {
                    dep[model["@id"]].push(content.schema)
                }
            })
        }
        if(model.extends) {
            dep[model["@id"]].push(...model.extends)
        }

    })
    return dep
}

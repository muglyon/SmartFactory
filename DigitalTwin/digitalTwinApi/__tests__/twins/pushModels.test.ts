import pushModels from "../../src/twins/models/pushModels"
import { ModelList } from "../../src/types/modelType"

describe("pushModels tests", () => {


    const models: ModelList = {
        "dtmi:example:grid:plants:basePlant;1": {
            "@id": "dtmi:example:grid:plants:basePlant;1",
            "@context": "dtmi:dtdl:context;2",
            "@type": "Interface",
            "displayName": "Base Plant",
            "contents": [
                {
                    "@type": "Property",
                    "name": "Output",
                    "schema": "double"
                },
                {
                    "@type": "Relationship",
                    "name": "feeds",
                    "target": "dtmi:example:grid:transmission:powerLine;1"
                },
            ]
        },
        "dtmi:example:grid:transmission:powerLine;1": {
            "@id": "dtmi:example:grid:transmission:powerLine;1",
            "@context": "dtmi:dtdl:context;2",
            "@type": "Interface",
            "displayName": "Power Line",
            "contents": [
                {
                    "@type": "Property",
                    "name": "Capacity",
                    "schema": "double"
                },
                {
                    "@type": "Property",
                    "name": "GridType",
                    "schema": "string"
                }
            ],
        }
    }

    it("by default, should create all models sent with good order for dependencies", async () => {
        const service = {
            listModels: jest.fn().mockReturnValue([]),
            createModels: jest.fn().mockReturnValue({ _response: { status: 201 } })

        }

        const result = await pushModels(service as any, models)

        expect(result).toEqual([
            "Modele dtmi:example:grid:transmission:powerLine;1 créé",
            "Modele dtmi:example:grid:plants:basePlant;1 créé",
        ])

       expect(service.listModels).toHaveBeenCalledTimes(1)
       expect(service.createModels).toHaveBeenCalledTimes(2)

       expect(service.createModels.mock.calls[0][0]).toEqual([models["dtmi:example:grid:transmission:powerLine;1"]])
       expect(service.createModels.mock.calls[1][0]).toEqual([models["dtmi:example:grid:plants:basePlant;1"]])
    })

    it("If service return an error, should add it to message list", async () => {
        const service = {
            listModels: jest.fn().mockReturnValue([]),
            createModels: jest.fn().mockReturnValue({ _response: { status: 404 , bodyAsText: "Random Error"} })

        }

        

        const result = await pushModels(service as any, models)

        expect(result).toEqual([
            "Erreur lors de la création du modèle dtmi:example:grid:transmission:powerLine;1 : Random Error",
            "Les modeles dtmi:example:grid:plants:basePlant;1 possèdent des dépendances inconnues",
        ])

       expect(service.listModels).toHaveBeenCalledTimes(1)
       expect(service.createModels).toHaveBeenCalledTimes(1)

       expect(service.createModels.mock.calls[0][0]).toEqual([models["dtmi:example:grid:transmission:powerLine;1"]])
    })

    it("When one model already exist, should add message", async () => {
        const service = {
            listModels: jest.fn().mockReturnValue([{id: "dtmi:example:grid:transmission:powerLine;1"}]),
            createModels: jest.fn().mockReturnValue({ _response: { status: 201 } })

        }

        const result = await pushModels(service as any, models)

        expect(result).toEqual([
            "Modele dtmi:example:grid:plants:basePlant;1 créé",
            "Le modele dtmi:example:grid:transmission:powerLine;1 existe déjà. Import annulé",
        ])

       expect(service.listModels).toHaveBeenCalledTimes(1)
       expect(service.createModels).toHaveBeenCalledTimes(1)

       expect(service.createModels.mock.calls[0][0]).toEqual([models["dtmi:example:grid:plants:basePlant;1"]])
    })

    it("If one dependencie is missing, should add error message", async () => {
        const service = {
            listModels: jest.fn().mockReturnValue([{id: "dtmi:example:grid:transmission:powerLine;1"}]),
            createModels: jest.fn().mockReturnValue({ _response: { status: 201 } })

        }

        const models: ModelList = {
            "dtmi:example:grid:plants:basePlant;1": {
                "@id": "dtmi:example:grid:plants:basePlant;1",
                "@context": "dtmi:dtdl:context;2",
                "@type": "Interface",
                "displayName": "Base Plant",
                extends: ["dtmi:example:grid:transmission:powerLine;1", "unknown id"],
                "contents": [
                    {
                        "@type": "Property",
                        "name": "Output",
                        "schema": "double"
                    },
                    {
                        "@type": "Relationship",
                        "name": "feeds",
                        "target": "dtmi:example:grid:transmission:powerLine;1"
                    },
                ]
            },
            "dtmi:example:grid:transmission:powerLine;1": {
                "@id": "dtmi:example:grid:transmission:powerLine;1",
                "@context": "dtmi:dtdl:context;2",
                "@type": "Interface",
                "displayName": "Power Line",
                extends: ["unknown id"],
                "contents": [
                    {
                        "@type": "Property",
                        "name": "Capacity",
                        "schema": "double"
                    },
                    {
                        "@type": "Property",
                        "name": "GridType",
                        "schema": "string"
                    }
                ],
            }
        }

        const result = await pushModels(service as any, models)

        expect(result).toEqual([
            `Les modeles ${Object.keys(models).join(', ')} possèdent des dépendances inconnues`
        ])

       expect(service.listModels).toHaveBeenCalledTimes(1)
       expect(service.createModels).toHaveBeenCalledTimes(0)
    })
})
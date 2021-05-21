
jest.mock('../../src/twins/relationships/createRelationships')
import createInstances from "../../src/twins/instances/createInstances"
import * as createRelationships from "../../src/twins/relationships/createRelationships"
import { Instance } from "../../src/types/instanceType"

describe("createInstances tests", () => {

    const models = {
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
                {
                    "@type": "Property",
                    "name": "EmissionType",
                    "comment": "[GLOBALTYPE]",
                    "schema": {
                        "@type": "Enum",
                        "valueSchema": "string",
                        "enumValues": [
                            {
                                "name": "Renewable",
                                "displayName": "Renewable",
                                "enumValue": "Renewable"
                            },
                            {
                                "name": "Traditional",
                                "displayName": "Traditional",
                                "enumValue": "Traditional"
                            }
                        ]
                    }
                },
                {
                    "@type": "Component",
                    "name": "ManufacturerInfo",
                    "comment": "[GLOBALTYPE]",
                    "schema": {
                        "@type": "Object",
                        "comment": "[GLOBALTYPE]",
                        "fields": [
                            {
                                "name": "Name",
                                "schema": "string"
                            },
                            {
                                "name": "Address",
                                "schema": {
                                    "@type": "Object",
                                    "comment": "[GLOBALTYPE]",
                                    "fields": [
                                        {
                                            "name": "Street",
                                            "schema": "string"
                                        },
                                        {
                                            "name": "City",
                                            "schema": "string"
                                        },
                                        {
                                            "name": "Zip",
                                            "schema": "string"
                                        },
                                        {
                                            "name": "Country",
                                            "schema": "string"
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        },
        "dtmi:example:grid:plants:cityPlant;1": {
            "@id": "dtmi:example:grid:plants:cityPlant;1",
            "@context": "dtmi:dtdl:context;2",
            "@type": "Interface",
            "extends": ["dtmi:example:grid:plants:basePlant;1"],
            "displayName": "City Plant"
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
                    "schema": "dtmi:example:grid:gridTypeEnum;1"
                }
            ],
            "schemas": [
                {
                    "@type": "Enum",
                    "valueSchema": "string",
                    "@id": "dtmi:example:grid:gridTypeEnum;1",
                    "enumValues": [
                        {
                            "name": "ExtraHighVoltage",
                            "enumValue": "ExtraHighVoltage"
                        },
                        {
                            "name": "HighVoltage",
                            "enumValue": "HighVoltage"
                        },
                        {
                            "name": "Distribution",
                            "enumValue": "Distribution"
                        }
                    ]
                }
            ]
        }
    }

    const instances: Instance[] = [
        {
            model: 'Without ID'
        } as any,
        {
            model: 'dtmi:example:grid:plants:cityPlant;1',
            Id: 'plant3',
            Output: 300,
            feeds: 'Power1',
            EmissionType: 'Traditional',
            'ManufacturerInfo.Name': 'Toto',
            'ManufacturerInfo.Address.Street': 'Rue de Lyon',
            'ManufacturerInfo.Address.City': 'Lyon',
            'ManufacturerInfo.Address.Zip': "69001 Lyon",
            'ManufacturerInfo.Address.Country': 'France'
        },
        {
            model: 'dtmi:example:grid:transmission:powerLine;1',
            Id: 'Power1',
            Capacity: 100,
            GridType: 'HighVoltage',
            UnknownKey: "byebye"
        },
    ]

    it("Should call upsertRelationShip for all items in models", async () => {
        const service = {
            getModel: jest.fn().mockImplementation((id) => {
                return {
                    id,
                    model: models[id]
                }
            }),
            upsertDigitalTwin: jest.fn().mockImplementation(() => new Promise((res, rej) => res(undefined)))

        }

        jest.spyOn(createRelationships, 'default').mockReturnValue(new Promise((res, rej) => res([])))
        const result = await createInstances(service as any, instances)

        expect(result).toEqual([
            "Id ou modele manquant pour l'instance {\"model\":\"Without ID\"}"
        ])

        expect(service.getModel).toHaveBeenCalledTimes(3)
        expect(service.getModel.mock.calls[0]).toEqual(["dtmi:example:grid:plants:cityPlant;1", true])
        expect(service.getModel.mock.calls[1]).toEqual(["dtmi:example:grid:transmission:powerLine;1", true])
        expect(service.getModel.mock.calls[2]).toEqual(["dtmi:example:grid:plants:basePlant;1", true])

        expect(service.upsertDigitalTwin).toHaveBeenCalledTimes(2)

        expect(service.upsertDigitalTwin.mock.calls[0]).toEqual(['Power1', {
            $metadata: {
                $model: "dtmi:example:grid:transmission:powerLine;1"
            },
            Capacity: 100,
            GridType: 'HighVoltage'
        }])
        expect(service.upsertDigitalTwin.mock.calls[1]).toEqual(['plant3', {
            $metadata: {
                $model: "dtmi:example:grid:plants:cityPlant;1"
            },
            Output: 300,
            EmissionType: 'Traditional',
            ManufacturerInfo: {
                $metadata: {},
                Name: 'Toto',
                Address: {
                    Street: 'Rue de Lyon',
                    City: "Lyon",
                    Zip: "69001 Lyon",
                    Country: 'France'
                }
            }
        }])

        expect(createRelationships.default).toHaveBeenCalledWith(service, [{
            name: 'feeds',
            source: 'plant3',
            target: 'Power1'
        }])
    })

    it("Should call upsertRelationShip for all items in models", async () => {
        const service = {
            getModel: jest.fn()
                .mockImplementationOnce((id) => { throw {details: {error: 'Model unknown : ' + id}} })
                .mockImplementation((id) => {
                    return {
                        id,
                        model: models[id]
                    }
                }),

            upsertDigitalTwin: jest.fn()
                .mockImplementation(() => new Promise((res, rej) => rej( {details: {error: 'Network error'} })))

        }

        jest.spyOn(createRelationships, 'default').mockReturnValue(new Promise((res, rej) => res([])))
        const result = await createInstances(service as any, instances)

        expect(result).toEqual([
            "Id ou modele manquant pour l'instance {\"model\":\"Without ID\"}",
            "Model unknown : dtmi:example:grid:plants:cityPlant;1",
            "id: Power1 --> Network error"
        ])

        expect(service.getModel).toHaveBeenCalledTimes(2)
        expect(service.getModel.mock.calls[0]).toEqual(["dtmi:example:grid:plants:cityPlant;1", true])
        expect(service.getModel.mock.calls[1]).toEqual(["dtmi:example:grid:transmission:powerLine;1", true])

        expect(service.upsertDigitalTwin).toHaveBeenCalledTimes(1)

        expect(service.upsertDigitalTwin.mock.calls[0]).toEqual(['Power1', {
            $metadata: {
                $model: "dtmi:example:grid:transmission:powerLine;1"
            },
            Capacity: 100,
            GridType: 'HighVoltage'
        }])
        
        expect(createRelationships.default).toHaveBeenCalledWith(service, [])
    })


})
import { jsonLoaderFolder, jsonLoader } from '../../src/parser/jsonLoader'

describe("jsonLoader tests", () => {
    it("jsonLoader should return file as json object", () => {
        expect(jsonLoader('./__tests__/assets/CityPlant.json')).toEqual({
            "@id": "dtmi:example:grid:plants:cityPlant;1",
            "@context": "dtmi:dtdl:context;2",
            "@type": "Interface",
            "extends": ["dtmi:example:grid:plants:basePlant;1"],
            "displayName": "City Plant"
        })
    })

    it("jsonLoaderFolder in folder without json should return empty object", async () => {
        const models = await jsonLoaderFolder('./__tests__/assets/instances')

        expect(models).toEqual({})

    })

    it("jsonLoaderFolder should read all json file in directory", async () => {
        const models = await jsonLoaderFolder('./__tests__/assets')

        const expected = {
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
                        "@type": "Property",
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
        expect(models).toEqual(expected)
    })




})
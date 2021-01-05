import { csvLoaderFolder, csvLoader } from '../../src/parser/csvLoader'

describe("csvLoader tests", () => {
    it("csvLoader should return file as csv object", async () => {
        const items = await csvLoader('./__tests__/assets/relations.csv')
        expect(items).toEqual([{
            source: "plant1",
            name: "feeds",
            target: "Power1"
        },
        {
            source: "plant1",
            name: "feeds",
            target: "Power2"
        },
        {
            source: "plant2",
            name: "feeds",
            target: "Power1"
        }])
    })

    it("csvLoaderFolder should read all csv file in directory", async () => {
        const items = await csvLoaderFolder('./__tests__/assets/instances')

        expect(items).toEqual([
            {
                model: 'dtmi:example:grid:plants:cityPlant;1',
                Id: 'plant1',
                Output: 200,
                EmissionType: 'Renewable',
                'ManufacturerInfo.Name': 'Toto',
                'ManufacturerInfo.Address.Street': 'Rue de Lyon',
                'ManufacturerInfo.Address.City': 'Lyon',
                'ManufacturerInfo.Address.Zip': "69001 Lyon",
                'ManufacturerInfo.Address.Country': 'France'
            },
            {
                model: 'dtmi:example:grid:plants:cityPlant;1',
                Id: 'plant2',
                Output: 100,
                EmissionType: 'Renewable',
                'ManufacturerInfo.Name': 'Toto',
                'ManufacturerInfo.Address.Street': 'Rue de Lyon',
                'ManufacturerInfo.Address.City': 'Lyon',
                'ManufacturerInfo.Address.Zip': "69001 Lyon",
                'ManufacturerInfo.Address.Country': 'France'
            },
            {
                model: 'dtmi:example:grid:plants:cityPlant;1',
                Id: 'plant3',
                Output: 300,
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
                GridType: 'HighVoltage'
            },
            {
                model: 'dtmi:example:grid:transmission:powerLine;1',
                Id: 'Power2',
                Capacity: 200,
                GridType: 'Distribution'
            }
        ])

    })




})
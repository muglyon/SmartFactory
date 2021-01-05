import csvDataParser from '../../src/parser/csvDataParser'

describe("csvDataParser tests", () => {
    it("csvDataParser should return file as csv object", async () => {
        const input = {
            'Name': 'Bob',
            'Output': 3000,
            'ManufacturerInfo.Name': 'Toto',
            'ManufacturerInfo.Address.Street': 'Rue de Lyon',
            'ManufacturerInfo.Address.City': 'Lyon',
            'ManufacturerInfo.Address.Zip': 69001,
            'ManufacturerInfo.Address.Country': 'France'
        }
        const items = csvDataParser(input)
        expect(items).toEqual({
            Name: 'Bob',
            Output: 3000,
            ManufacturerInfo: {
                Name: 'Toto',
                Address: {
                    Street: 'Rue de Lyon',
                    City: "Lyon",
                    Zip: 69001,
                    Country: 'France'
                }
            }
        })
    })





})
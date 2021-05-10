import jsonPatch from '../../src/parser/jsonPatch'

describe("jsonPatch tests", () => {
    it("Empty object should return empty array", () => {
        expect(jsonPatch({})).toEqual([])
    })

    it("JsonPatch should return object with json patch format", () => {
        const json = {
            first: 1,
            second: "toto", 
            third: {
                test: '275'
            }
        }

        const expected = [{
            "op": "add",
            "path": "/first",
            "value": 1
        },
        {
            "op": "add",
            "path": "/second",
            "value": 'toto'
        },
        {
            "op": "add",
            "path": "/third",
            "value": {
                test: '275'
            }
        }]

        expect(jsonPatch(json)).toEqual(expected)
    
    })


})
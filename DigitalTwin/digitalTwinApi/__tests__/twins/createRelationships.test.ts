
import createRelationships from "../../src/twins/relationships/createRelationships"
import { RelationshipDefinition } from "../../src/types/relationshipType"

describe("createRelationships tests", () => {

    const models: RelationshipDefinition[] = [{
        source: "first",
        name: "feeds",
        target: "second",
        property: 3,
        otherProperty: 'yes'
    },
    {
        source: "second",
        name: "feeds",
        target: "third",
        mother: {
            name: "Tata",
            surname: "Toto"
        }
    }]

    it("Should call upsertRelationShip for all items in models", async () => {
        const service = {
            upsertRelationship: jest.fn().mockReturnValue(new Promise((res, rej) => res("Created")))

        }

        const result = await createRelationships(service as any, models)
        
        expect(result).toEqual([])

        expect(service.upsertRelationship).toHaveBeenCalledTimes(2)
        expect(service.upsertRelationship.mock.calls[0]).toEqual(["first", 'first-feeds-second', {
            $relationshipId: 'first-feeds-second',
            $sourceId: "first",
            $relationshipName: "feeds",
            $targetId: "second",
            property: 3,
            otherProperty: 'yes'
        }])

        expect(service.upsertRelationship.mock.calls[1]).toEqual(["second", 'second-feeds-third', {
            $relationshipId: 'second-feeds-third',
            $sourceId: "second",
            $relationshipName: "feeds",
            $targetId: "third",
            mother: {
                name: "Tata",
                surname: "Toto"
            }
        }])
    })

    it("Should call upsertRelationShip for all items in models", async () => {
        const service = {
            upsertRelationship: jest.fn()
                .mockReturnValueOnce(new Promise((res, rej) => res("Created")))
                .mockReturnValueOnce(new Promise((res, rej) => rej({details: {error: "Bad relationship"}})))

        }

        const result = await createRelationships(service as any, models)

        expect(result).toEqual(["relationship for second --> Bad relationship"])

        expect(service.upsertRelationship).toHaveBeenCalledTimes(2)

    })

})
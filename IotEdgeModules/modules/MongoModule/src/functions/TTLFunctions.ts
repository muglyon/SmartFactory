import { Db } from "mongodb";
import * as constantes from '../constantes';

async function updateTTL(database: Db, ttlValue: number): Promise<void> {
    const collections = await database.collections()

    collections.forEach((collection) => {
        collection.dropIndex(collection.collectionName + constantes.TLL_PREFIX, (error) => {
            if (error) {
                console.error('Error during index deletion : ', error)
            } else {
                ttlFunctions.createTTL(database, collection.collectionName, ttlValue)
            }
        })
    })

}

function createTTL(database: Db, collection: string, ttlValue: number): void {
    database.collection(collection).createIndex(
        { "timestamp": 1 },
        { name: collection + constantes.TLL_PREFIX, expireAfterSeconds: ttlValue }
    )
}

const ttlFunctions = {
    updateTTL,
    createTTL
}

export default ttlFunctions;
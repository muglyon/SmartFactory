
import { DataInterface } from '../../src/types/messageType';
import { Db, Collection, MongoCallback, MongoError } from 'mongodb';

import ttlFunctions from '../../src/functions/TTLFunctions';

describe('updateTTL tests', () => {



    it('should call dropIndex and createIndex. collection2 should return an error', async () => {

        const db: Db = jest.fn() as unknown as Db

        db.collections = jest.fn(() => new Promise<Collection[]>((res, rej) => res([collectionItem1, collectionItem2])))

        const collectionItem1 = jest.fn() as unknown as Collection
        const collectionItem2 = jest.fn() as unknown as Collection

        collectionItem1.collectionName = 'item1'
        collectionItem2.collectionName = 'item2'
        collectionItem1.dropIndex = jest.fn().mockImplementation(jest.fn((indexName: string, callback: MongoCallback<any>) => { callback(undefined, undefined) }))
        collectionItem2.dropIndex = jest.fn().mockImplementation(jest.fn((indexName: string, callback: MongoCallback<any>) => { callback(new MongoError('random error'), undefined) }))

        const createTTLBackup = ttlFunctions.createTTL

        ttlFunctions.createTTL = jest.fn()

        await ttlFunctions.updateTTL(db, 3000)

        expect(collectionItem1.dropIndex).toHaveBeenCalledWith('item1_expiration', expect.any(Function))
        expect(collectionItem2.dropIndex).toHaveBeenCalledWith('item2_expiration', expect.any(Function))

        expect(ttlFunctions.createTTL).toHaveBeenCalledWith(db, 'item1', 3000)
        expect(ttlFunctions.createTTL).not.toHaveBeenCalledWith(db, 'item2', 3000)

        ttlFunctions.createTTL = createTTLBackup
    })

    it('createTTL should create index', () => {

        const collectionMock = jest.fn() as unknown as Collection
        collectionMock.createIndex = jest.fn()

        const db: Db = jest.fn() as unknown as Db
        db.collection = jest.fn((name) => collectionMock)


        ttlFunctions.createTTL(db, 'item1', 3000)

        expect(collectionMock.createIndex).toHaveBeenCalledWith(
            { "timestamp": 1 },
            { name: 'item1_expiration', expireAfterSeconds: 3000 }
        )
    })
})
import storeItems from '../../src/functions/storeItems';
import { DataInterface } from '../../src/types/messageType';
import { Db, Collection } from 'mongodb';

describe('storeItems tests', () => {

    it('should insert new documents', () => {

        const insertItem1 = jest.fn()
        const insertItem2 = jest.fn()

        const collectionItem1 = jest.fn() as unknown as Collection
        const collectionItem2 = jest.fn() as unknown as Collection

        collectionItem1.insertMany = insertItem1
        collectionItem2.insertMany = insertItem2

        const db: Db = jest.fn() as unknown as Db
        db.collection = jest.fn((name: string) => name == 'item1' ? collectionItem1 : collectionItem2)

        const items: DataInterface = {
            item1: [{
                timestamp: new Date("2019-11-25T10:57:41.0000000+00:00"),
                sensor1: 25,
                sensor2: 23
            }],
            item2: [{
                timestamp: new Date("2019-11-25T10:57:41.0000000+00:00"),
                sensor3: 25,
                sensor4: 23
            },
            {
                timestamp: new Date("2019-11-25T10:57:42.0000000+00:00"),
                sensor3: 10,
                sensor4: 12
            }]
        }

        storeItems(items, db)

        expect(db.collection).toHaveBeenCalledTimes(2)
        expect(db.collection).toHaveBeenNthCalledWith(1, 'item1')
        expect(db.collection).toHaveBeenNthCalledWith(2, 'item2')

        expect(insertItem1).toHaveBeenCalledTimes(1)

        expect(insertItem1).toHaveBeenCalledWith([
            {
                timestamp: new Date("2019-11-25T10:57:41.0000000+00:00"),
                sensor1: 25,
                sensor2: 23
            }
        ]
        )

        expect(insertItem2).toHaveBeenCalledTimes(1)

        expect(insertItem2).toHaveBeenCalledWith([
            {
                timestamp: new Date("2019-11-25T10:57:41.0000000+00:00"),
                sensor3: 25,
                sensor4: 23
            },
            {
                timestamp: new Date("2019-11-25T10:57:42.0000000+00:00"),
                sensor3: 10,
                sensor4: 12
            }
        ]
        )

    })

    it('should create indexes', () => {
        const updateOneItem1 = jest.fn()
        const updateOneItem2 = jest.fn()

        const collectionItem1 = jest.fn() as unknown as Collection
        const collectionItem2 = jest.fn() as unknown as Collection

        collectionItem1.insertMany = updateOneItem1
        collectionItem2.insertMany = updateOneItem2

        const db: Db = jest.fn() as unknown as Db
        db.collection = jest.fn((name: string) => name == 'item1' ? collectionItem1 : collectionItem2)

        const items: DataInterface = {
            item1: [{
                timestamp: new Date("2019-11-25T10:57:41.0000000+00:00"),
                sensor1: 25,
                sensor2: 23
            }],
            item2: [{
                timestamp: new Date("2019-11-25T10:57:41.0000000+00:00"),
                sensor3: 25,
                sensor4: 23
            },
            {
                timestamp: new Date("2019-11-25T10:57:42.0000000+00:00"),
                sensor3: 10,
                sensor4: 12
            }]
        }

        storeItems(items, db)

    })
})
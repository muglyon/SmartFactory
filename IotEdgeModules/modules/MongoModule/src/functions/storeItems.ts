import { DataInterface, CustomItem } from "../types/messageType";
import { Db } from "mongodb";

export default function storeItems(items: DataInterface, database: Db) {
    Object.keys(items).forEach((collectionName) => {
        if(Array.isArray(items[collectionName])) {
            database.collection(collectionName).insertMany(items[collectionName])
        } else {
            database.collection(collectionName).insertOne(items[collectionName])
        }
    })
}
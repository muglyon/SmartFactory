import { PublishedItem, DataInterface, CustomItem, InitialDataInterface, MessagePreparationType, TimestampedObject } from "../types/messageType";
import { createJsonMessage } from "./createJsonMessage";

export default function prepareMessage(publishedItem: PublishedItem[], initialData: InitialDataInterface): MessagePreparationType {
  const items: DataInterface = {};
  const newInitialData = JSON.parse(JSON.stringify(initialData))

  publishedItem.forEach((item) => {

    const dataKeys = item.DisplayName.split('.')
    
    createJsonMessage(items, dataKeys, newInitialData, item)
  })
  return {
    items,
    newInitialData
  };
}
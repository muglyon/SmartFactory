import { DataInterface, InitialDataInterface, ItemType, PublishedItem } from "../types/messageType";

export function createJsonMessage(datas: DataInterface, keys: string[], actualData: InitialDataInterface, value: PublishedItem) {
    const key = keys.shift();

    if(!datas[key]) {
        datas[key] = keys.length == 1 ? [] : {};
    }
    if(!actualData[key]) {
        actualData[key] = {}
    }

    if(keys.length == 1) {
        const valueKey: string = keys.shift();
        const dataArray = (datas[key] as ItemType);
        const index = dataArray.findIndex((item) => item.timestamp.getTime() == new Date(value.Value.SourceTimestamp).getTime())
        if(index == -1) {
            dataArray.push({
                ...actualData[key],
                timestamp: new Date(value.Value.SourceTimestamp),
                [valueKey]: value.Value.Value
            })
        } else {
            dataArray[index][valueKey] = value.Value.Value;
        }


        actualData[key][valueKey] = value.Value.Value

    } else {
        createJsonMessage(datas[key] as DataInterface, keys, actualData[key], value)
    }

}
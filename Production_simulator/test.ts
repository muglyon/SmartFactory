import getCsvDatas from "./src/functions/getCsvDatas";
import { WriteValueLike, } from "node-opcua";
import paths from './src/functions/path.json';
import { MessageType } from './src/types/messageType'

getCsvDatas().then((datas) => {
    const messageList: Array<MessageType> = []


    datas.forEach((line) => {
        const newPublishedItem: MessageType = {}
        let todayDate = new Date();
        const splitHour = line.hour.split(':')
        const timestamp = new Date(
            todayDate.getFullYear(),
            todayDate.getMonth(),
            todayDate.getDate(),
            splitHour[0],
            splitHour[1],
            splitHour[2],
            0
        )

        Object.keys(line).forEach((key) => {
            if (key != "hour") {
                console.log(paths[key]);
                const numberValue = parseFloat(line[key].replace(',', '.'))
                if (isNaN(numberValue)) {
                    newPublishedItem[paths[key].address] = line[key]

                } else {
                    newPublishedItem[paths[key].address] = numberValue
                }
            }
        })
        console.log(newPublishedItem)
        messageList.push(newPublishedItem)
    })

})
import { EWMAData } from "../../types/datas";

export default function splitEWMAData(datas: EWMAData[]) {
    const blue: EWMAData[] = []
    const red: EWMAData[] = []
    const green: EWMAData[] = []
    const grey: EWMAData[] = []

    datas.forEach((x) => {
        switch (x.mode) {
            case 'bad':
            case 'red':
                red.push(x)
                break;
            case 'good':
            case 'green':
                green.push(x)
                break;
            case 'learn':
            case 'blue':
                blue.push(x)
                break;
            case 'nd':
            default:
                grey.push(x)
                break;
        }
    })

    return {
        blue,
        red,
        green,
        grey
    }
}
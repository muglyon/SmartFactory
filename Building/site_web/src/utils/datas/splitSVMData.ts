import { SVMData } from "../../types/datas";

export default function splitSVMata(datas: SVMData[]) {
    const blue: SVMData[] = []
    const cyan: SVMData[] = []
    const red: SVMData[] = []
    const green: SVMData[] = []
    const grey: SVMData[] = []

    datas.forEach((x) => {
        switch (x.status) {
            case 'Alarme':
                red.push(x)
                break;
            case 'Surveillance':
                green.push(x)
                break;
            case 'Validation':
                cyan.push(x)
                break;
            case 'Apprentissage':
                blue.push(x)
                break;
            default:
                grey.push(x)
                break;
        }
    })

    return {
        blue,
        cyan,
        red,
        green,
        grey
    }
}
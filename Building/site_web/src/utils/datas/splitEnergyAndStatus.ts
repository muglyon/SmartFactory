import { StatusItem, EnergyItem, GetStatusByCETData } from '../../types/datas'
import isEnergyData from './isEnergyData'

export default function splitEnergyAndStatus(datas: (StatusItem | EnergyItem)[]): GetStatusByCETData {
    const energy: EnergyItem[] = []
    const status: StatusItem[] = []

    datas.forEach((x) => {
        if(isEnergyData(x)) {
            energy.push(x)
        } else {
            status.push(x)
        }
    })

    return {
        energy,
        status
    }
}
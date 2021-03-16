import { EnergyItem } from "../../types/datas";

export default function isEnergyData(data: any): data is EnergyItem {
    return Object.keys(data).includes("input_energy")
}
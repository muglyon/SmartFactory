import { EWMAData, GraphData } from "../../types/datas";

export default function isEWMAData(data: GraphData): data is EWMAData[] {
    return Object.keys(data[0]).includes("lower")
}
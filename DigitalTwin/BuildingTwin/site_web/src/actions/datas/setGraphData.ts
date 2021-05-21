import { GraphRequest } from "../../types/cosmos";
import { setGraphDataActionType } from "../../types/datas";

export default function setGraphData(graphData: GraphRequest[]): setGraphDataActionType {
    return {
        type: "SET_GRAPH_DATA",
        graphData
    }
}
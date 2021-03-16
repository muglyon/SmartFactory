import { GraphData, setGraphDataActionType } from "../../types/datas";

export default function setStatusAction(graphData: GraphData): setGraphDataActionType {
    return {
        type: "SET_GRAPH_DATA",
        graphData
    }
}
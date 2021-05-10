import { Datas, ProjectListAction, ProjectListState } from "../types/datas";

const projectListInitState: ProjectListState = {
    twinData: {} as Datas,
    graphData: [],
    deviceTwin: {},
    huile: {}
};

export default function projectListReducer(state: ProjectListState = projectListInitState, action: ProjectListAction): ProjectListState {
    switch (action.type) {
        case "ADD_MESSAGE":
            return {
                ...state,
                twinData: action.payload
            };
        case "SET_GRAPH_DATA":
            return {
                ...state,
                graphData: action.graphData
            }
        case "ADD_HUILE_MESSAGE":
            const newHuile = {...state.huile}
            Object.keys(action.payload).forEach((key) => {
                if(!newHuile[key]) {
                    newHuile[key] = []
                }
                newHuile[key] = [...newHuile[key], action.payload[key]]
                if(newHuile[key].length > 30){
                    newHuile[key].shift()
                }
            })
            return {
                ...state,
                huile: newHuile
            }
        case "SET_DEVICE_TWIN":
            return {
                ...state,
                deviceTwin: action.deviceTwin
            }
        default:
            return state;
    }
}
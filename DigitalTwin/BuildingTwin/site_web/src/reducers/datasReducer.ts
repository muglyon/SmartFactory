import { Datas, ProjectListAction, ProjectListState } from "../types/datas";

const projectListInitState: ProjectListState = {
    twinData: {} as Datas,
    graphData: [],
    deviceTwin: {}
};

export default function projectListReducer(state: ProjectListState = projectListInitState, action: ProjectListAction): ProjectListState {
    switch (action.type) {
        case "ADD_MESSAGE":
            return {
                ...state,
                twinData: {
                    ...state.twinData,
                    ...action.payload
                }
            };
        case "SET_GRAPH_DATA":
            return {
                ...state,
                graphData: action.graphData
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
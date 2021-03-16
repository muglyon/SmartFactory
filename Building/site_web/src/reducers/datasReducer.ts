import { ProjectListAction, ProjectListState } from "../types/datas";
import getImageNameByStatusItems from "../utils/getImageNameByStatus";

const projectListInitState: ProjectListState = {
    CET: {
        list: undefined,
        current: undefined
    },
    status: {
        energy: [],
        status: []
    },
    images: {
        engrenagePicture: "scen0",
        zoomEngrenagePicture: "scenA"
    },
    graphData: []
};

export default function projectListReducer(state: ProjectListState = projectListInitState, action: ProjectListAction): ProjectListState {
    switch (action.type) {
        case "PROJECT_LIST_SET":
            return {
                ...state,
                CET: {
                    ...state.CET,
                    list: action.projectList,
                }
            };
        case "PROJECT_LIST_CURRENT":
            return {
                ...state,
                CET: {
                    ...state.CET,
                    current: action.current
                }
            };
        case "STATUS_LIST_SET":
            return {
                ...state,
                status: action.statusItemList,
                images: getImageNameByStatusItems(action.statusItemList.status)
            };
        case "SET_GRAPH_DATA":
            return {
                ...state,
                graphData: action.graphData
            }
        default:
            return state;
    }
}
import { Status } from "azure-iothub/dist/pl/models";

export interface ProjectList {
    CETEssai: string;
    time?: string;
}


export interface InitProjectList {
    projectList: ProjectList[];
}

export interface ProjectListState {
    CET: {
        list?: ProjectList[];
        current?: ProjectList;
    }
    status: GetStatusByCETData;
    images: ImageType
    graphData: GraphData;
}

export interface ImageType {
    engrenagePicture: string;
    zoomEngrenagePicture: string;
}
export type GraphData = SVMData[] | EWMAData[]

export interface StatusItem {
    name: string;
    ObjName: string;
    status?: string;
    mode?: string;
}

export interface EnergyItem {
    name: string;
    input_energy: number;
    output_energy: number;
}

export interface GetStatusByCETData {
    energy: EnergyItem[];
    status: StatusItem[];
}

export interface StatusMapping {
    'Roulement Principal': string;
    'Engrenage Principal': string;
    'Génératrice': string;
    'Engrenage-Pignon': string;
    'Engrenage-Roue': string;
}

export type ProjectListAction = ProjectListSetAction | ProjectListSetCurrent | setStatusActionType | setGraphDataActionType;

export interface ProjectListSetAction {
    type: "PROJECT_LIST_SET";
    projectList: ProjectList[];
}

export interface ProjectListSetCurrent {
    type: "PROJECT_LIST_CURRENT";
    current: ProjectList;
}

export interface setStatusActionType {
    type: "STATUS_LIST_SET";
    statusItemList: GetStatusByCETData;
}

export interface setGraphDataActionType {
    type: "SET_GRAPH_DATA";
    graphData: GraphData;
}

export interface EWMAData {
    CET: string;
    essai: number;
    name: string;
    ObjName: string;
    time: Date;
    y: number;
    lower: number;
    upper: number;
    mode: string;
}

export interface SVMData {
    CET: string;
    essai: number;
    name: string;
    ObjName: string;
    time: Date;
    rolling_mean: number;
    status: string;
    y: number;
}
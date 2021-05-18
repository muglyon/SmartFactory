import { Status } from "azure-iothub/dist/pl/models";
import { AddDataAction } from "./SocketProvider";


export interface InitProjectList {
    projectList: ProjectList[];
}

export interface ProjectListState {
    twinData: Datas;
    graphData: any;
    deviceTwin: { [key: string]: any }
}



export type ProjectListAction = AddDataAction | setGraphDataActionType | setDeviceTwinActionType ;


export interface setGraphDataActionType {
    type: "SET_GRAPH_DATA";
    graphData: any[];
}

export interface setDeviceTwinActionType {
    type: "SET_DEVICE_TWIN";
    deviceTwin: { [key: string]: any }
}

export interface Datas {
    Hall_01: Hall;
    Hall_02: Hall;
    Hall_03: Hall;
    Light_01: Light;
    Light_02: Light;
    Light_03: Light;
    Clim_01: Clim;
    Clim_02: Clim;
    Clim_03: Clim;
    Escalator_01: Escalator;
    Escalator_02: Escalator;
    Escalator_03: Escalator;
}

export interface Clim {
    date: Date;
    version: string;
    consumption: number;
    temperature: number;
    desiredTemperature: number;
}

export interface Escalator {
    date: Date;
    isRunning: boolean;
    consumption: number;
}

export interface Light {
    date: Date;
    isRunning: boolean;
    consumption: number;
    luminosity: number;
}

export interface Hall {
    date: Date;
    width: number;
    height: number;
    length: number;
    eco: number;
    globalConsumption: number;
    nbPeople: number;
}
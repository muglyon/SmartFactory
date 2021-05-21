export interface Datas {
    "date": string;
    "temp": number;
    "luminosity": number;
    escalatorConsumption: number;
    lightConsumption: number;
    climConsumption: number;
    "nbPeople": number;
}

export interface TwinProperties {
    targetTemp: number;
    length: number;
    width: number;
    height: number;
    climVersion: string;
    isEscalatorRun: boolean;
    isLightRun: boolean;
    alarmDecibels: number;
}
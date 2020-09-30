export interface UpdateDataType {
    [key: string]: any
}

export interface PredictionType {
    tagName: string;
    probability: number;
    tagId: string;
    boundingBox: undefined;
}

export interface CameraMessage {
    type: string;
    data: CameraDataMessage;
}

export interface CameraDataMessage {
    id: string;
    project: string;
    iteration: string;
    created: string;
    predictions: PredictionType[]; 
}
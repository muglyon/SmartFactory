export const HTTP_CODE_200 = 200;
export const HTTP_CODE_500 = 500;
export const HTTP_CODE_400 = 400;
export const MODULE_NAME = "DataUpdater";
export const DATA_UPDATE_METHOD_NAME = "DataUpdate"
export const CONFIG_PATH = "/appdata/pn.json";
export const GYROPHARE_DISPLAY_NAME = process.env.GYROPHARE_DISPLAY_NAME || "PLC.InputData"
export const PROCESSING_UPDATE_NAME = "dataProcessing"
export const CAMERA_UPDATE_NAME = "camera"
export const GYROPHARE_BIN_PLACE = parseInt(process.env.GYROPHARE_BIN_PLACE) || 2

export const ROBOT_NODE_NAME = process.env.ROBOT_NODE_NAME || "ROBOT.Type"
export const PREDICTION_TAG_VALUES = process.env.PREDICTION_TAG_VALUES ?
    JSON.parse(process.env.PREDICTION_TAG_VALUES) :
    {
        "Negative": 0,
        "Rouge": 1,
        "Jaune": 2,
        "Vert": 3
    }
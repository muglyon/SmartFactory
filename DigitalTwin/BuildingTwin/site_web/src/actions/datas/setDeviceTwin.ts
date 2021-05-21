import { setDeviceTwinActionType } from "../../types/datas";

export default function setDeviceTwin(twin: any): setDeviceTwinActionType {
    return {
        type: "SET_DEVICE_TWIN",
        deviceTwin: twin
    }
}
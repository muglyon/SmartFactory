import { setStatusActionType, GetStatusByCETData } from "../../types/datas";

export default function setStatusAction(statusItemList: GetStatusByCETData): setStatusActionType {
    return {
        type: "STATUS_LIST_SET",
        statusItemList
    }
}
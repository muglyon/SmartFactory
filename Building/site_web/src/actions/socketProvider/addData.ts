import { FrontMessage } from "../../types/SocketProvider";
import { AddDataAction } from '../../types/SocketProvider';

export default function addData(message: FrontMessage): AddDataAction {
    return {
        type: "ADD_MESSAGE",
        payload : message
    };
}

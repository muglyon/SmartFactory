import { AddDataAction } from '../../types/SocketProvider';

export default function addData(message: any): AddDataAction {
    return {
        type: "ADD_MESSAGE",
        payload : message
    };
}

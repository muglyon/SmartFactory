import { AddHuileDataAction } from '../../types/SocketProvider';

export default function addHuileData(message: any): AddHuileDataAction {
    return {
        type: "ADD_HUILE_MESSAGE",
        payload : message
    };
}

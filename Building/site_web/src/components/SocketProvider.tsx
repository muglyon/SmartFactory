import io from "socket.io-client";
import { useDispatch } from "react-redux"
import addData from "../actions/socketProvider/addData";
import { FrontMessage } from '../types/SocketProvider';

export default function SocketProvider() {
    const dispatch = useDispatch();

    io().on("newDatas", (data: FrontMessage) => {
        dispatch(addData(data));
    }).on('newWarning', (message: string) => {
        console.warn(message);
    });
    

    return null;
}

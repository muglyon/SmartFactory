import io from "socket.io-client";
import { useDispatch } from "react-redux"
import addData from "../actions/socketProvider/addData";
import addHuileData from "../actions/socketProvider/addHuileData";
// import { FrontMessage } from '../types/SocketProvider';

export default function SocketProvider() {
    const dispatch = useDispatch();
    io().on("twinData", (data: any) => {
        dispatch(addData(data))
    }).on('huileData', (data: any) => {
        dispatch(addHuileData(data))
    })
    

    return null;
}

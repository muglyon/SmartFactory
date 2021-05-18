import io from "socket.io-client";
import { useDispatch } from "react-redux"
import addData from "../actions/socketProvider/addData";
// import { FrontMessage } from '../types/SocketProvider';

export default function SocketProvider() {
    const dispatch = useDispatch();
    io().on("twinData", (data: any) => {
        console.log(data)
        dispatch(addData(data))
    })
    

    return null;
}

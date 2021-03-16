import { useSelector } from "react-redux"
import { Close } from '@material-ui/icons';
import { CircularProgress, IconButton, Tooltip } from '@material-ui/core';
import { GraphData } from "../../types/datas"
import { GlobalState } from "../../types/globalState"
import isEWMAData from "../../utils/datas/isEWMAData"
import GraphEWMA from "./GraphEWMA"
import GraphSVM from "./GraphSVM"
import { useRouter } from "next/router";
import isEmptyArray from "../../utils/datas/isEmptyArray";
export default function GraphProxy() {

    const router = useRouter();
    const data = useSelector<GlobalState, GraphData>((state) => state.datas.graphData)

    return <div style={{ display: "inline-flex" }}>
        {isEmptyArray(data) ?
            <div><CircularProgress color="inherit" size={20} /> Chargement </div>
    : isEWMAData(data) ? <GraphEWMA datas={data} />
                : <GraphSVM datas={data} />}


        <Tooltip title="Fermer cette fenêtre" placement="top">
            <IconButton onClick={() => router.push("/")} className="exitButton">
                <Close />
            </IconButton>
        </Tooltip>
    </div>


}
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { GlobalState } from "../src/types/globalState";
import setGraphData from "../src/actions/datas/setGraphData";
import Database from "../src/service/Database.service";
import { Datas } from "../src/types/datas";
import Graph from "../src/components/Graph/Graph";
import '../src/styles/index.scss'
import handleModalAction from "../src/actions/modal/handleModalAction";
// import Thermometer from 'react-thermometer-component'

export default function index() {
    const dispatch = useDispatch();
    const [title, setTitle] = useState("");
    const twinData = useSelector<GlobalState, Datas>((state) => state.datas.twinData);


    
    //@ts-ignore (Conflit dans la définition de type node).
    // const handleClickArea = (e: MouseEvent<HTMLAreaElement, MouseEvent>) => {
    //     e.preventDefault();
    //     const composantName = e.target.id;
    //     const indicatorListForDrawer = elementsIndicatorMap[composantName];

    //     dispatch(drawerSetTitleAction(title));
    //     dispatch(drawerSetContentAction(changeStatusToDrawerContent(status)));
    //     dispatch(drawerToggleAction(true));
    // }
    const imageHandler = (twin, key) => {
        Database.queryGraphData(twin, key).then((value) => {
            console.log("AFTER GRAPH DATA")
            console.log(value)
            dispatch(setGraphData(value))
        })
        dispatch(handleModalAction(true, <Graph twin={twin} dataKey={key} />))
    }


    if (Object.keys(twinData).length == 0) return null;

    const peopleSurface1 = (twinData.Hall_01.width*twinData.Hall_01.length / twinData.Hall_01.nbPeople)
    const peopleSurface2 = (twinData.Hall_02.width*twinData.Hall_02.length / twinData.Hall_02.nbPeople)
    const peopleSurface3 = (twinData.Hall_03.width*twinData.Hall_03.length / twinData.Hall_03.nbPeople)

    const THRESHOLD = 4;
    return <>
        <div className="grid-container">
            <div className="Escalator_1">
                <img src="./esc.svg" onClick={() => imageHandler("Escalator_01", "consumption")} />
                <br />
                P=<b>{twinData.Escalator_01.consumption.toFixed(1)}</b>kwH
                <br />
                Esc_1
            </div>
            <div className="Escalator_2">
                <img src="./esc.svg" onClick={() => imageHandler("Escalator_02", "consumption")} />
                <br />
                P=<b>{twinData.Escalator_02.consumption.toFixed(1)}</b>kwH
                <br />
                Esc_2
            </div>
            <div className="Escalator_3">
                <img src="./esc.svg" onClick={() => imageHandler("Escalator_03", "consumption")} />
                <br />
                P=<b>{twinData.Escalator_03.consumption.toFixed(1)}</b>kwH
                <br />
                Esc_3
            </div>
            <div className="Hall_3">
                <div>
                Hall 3
                <br />
                V = {twinData.Hall_03.width}m*{twinData.Hall_03.length}m*{twinData.Hall_03.height}m
                <br />
                Eco={twinData.Hall_03.eco.toFixed(2)} kg eqCO2
                <br />
                {twinData.Hall_03.nbPeople} visiteurs - <span style={{
                    color: peopleSurface3 < THRESHOLD ? "red": "green"
                }}>{peopleSurface3.toFixed(1)}m²/pers</span>
                </div>
                <img src="./leaf.svg" onClick={() => imageHandler("Hall_03", "eco")} />
            </div>
            <div className="Hall_2">
                <div>
                Hall 2
                <br />
                V = {twinData.Hall_02.width}m*{twinData.Hall_02.length}m*{twinData.Hall_02.height}m
                <br />
                Eco={twinData.Hall_02.eco.toFixed(2)} kg eqCO2
                <br />
                {twinData.Hall_02.nbPeople} visiteurs - <span style={{
                    color: peopleSurface2 < THRESHOLD ? "red": "green"
                }}>{peopleSurface2.toFixed(1)}m²/pers</span>
                </div>
                <img src="./leaf.svg" onClick={() => imageHandler("Hall_02", "eco")} />
            </div>
            <div className="Hall_1">
                <div>
                Hall 1
                <br />
                V = {twinData.Hall_01.width}m*{twinData.Hall_01.length}m*{twinData.Hall_01.height}m
                <br />
                Eco={twinData.Hall_01.eco.toFixed(2)} kg eqCO2
                <br />
                {twinData.Hall_01.nbPeople} visiteurs - <span style={{
                    color: peopleSurface1 < THRESHOLD ? "red": "green"
                }}>{peopleSurface1.toFixed(1)}m²/pers</span>
                </div>
                <img src="./leaf.svg" onClick={() => imageHandler("Hall_01", "eco")} />
            </div>
            <div className="Light_3">
                Lum 3 = {twinData.Light_03.luminosity} Lumens
                <br />
                <img src="./light.svg" onClick={() => imageHandler("Light_03", "luminosity")} />
            </div>
            <div className="Light_2">
                Lum 2 = {twinData.Light_02.luminosity} Lumens
                <br />
                <img src="./light.svg"  onClick={() => imageHandler("Light_02", "luminosity")} />
            </div>
            <div className="Light_1">
                Lum 1 = {twinData.Light_01.luminosity} Lumens
                <br />
                <img src="./light.svg" onClick={() => imageHandler("Light_01", "luminosity")} />
            </div>
            <div className="Clim_3_version">
                Clim 3
                <br />
                <a href="https://www.youtube.com/watch?v=Oj5Yqof-Tt0" target="_blank">MàJ appli: v{twinData.Clim_03.version}</a>
                <br />
                <img src="./clim.svg" />
            </div>
            <div className="Clim_2_version">

                Clim 2
                <br />
                <a href="https://www.youtube.com/watch?v=Oj5Yqof-Tt0" target="_blank">MàJ appli: v{twinData.Clim_02.version}</a>
                <br />
                <img src="./clim.svg" />
            </div>
            <div className="Clim_1_version">

                Clim 1
                <br />
                <a href="https://www.youtube.com/watch?v=Oj5Yqof-Tt0" target="_blank"> MàJ appli: v{twinData.Clim_01.version}</a>
                <br />
                <img src="./clim.svg" />
            </div>
            <div className="Clim_3_temp">
                Temp 3 = {twinData.Clim_03.temperature.toFixed(2)}°C
                <br />
                Désirée = {twinData.Clim_03.desiredTemperature}°C
                <br />
                <img src="./temp.svg" onClick={() => imageHandler("Clim_03", "temperature")} />
            </div>
            <div className="Clim_2_temp">
                Temp 2 = {twinData.Clim_02.temperature.toFixed(2)}°C
                <br />
                Désirée = {twinData.Clim_02.desiredTemperature}°C
                <br />
                <img src="./temp.svg" onClick={() => imageHandler("Clim_02", "temperature")} />
            </div>
            <div className="Clim_1_temp">
                Temp 1 = {twinData.Clim_01.temperature.toFixed(2)}°C
                <br />
                Désirée = {twinData.Clim_01.desiredTemperature}°C
                <br />
                <img src="./temp.svg" onClick={() => imageHandler("Clim_01", "temperature")} />
            </div>
            <div className="Clim_3_conso">
                Conso 3 = {twinData.Clim_03.consumption}W
                <br />
                <img src="./conso.svg" onClick={() => imageHandler("Clim_03", "consumption")} />
            </div>
            <div className="Clim_2_conso">

                Conso 2 = {twinData.Clim_02.consumption}W
                <br />
                <img src="./conso.svg" onClick={() => imageHandler("Clim_02", "consumption")} />
            </div>
            <div className="Clim_1_conso">

                Conso 1 = {twinData.Clim_01.consumption}W
                <br />
                <img src="./conso.svg" onClick={() => imageHandler("Clim_01", "consumption")} />
            </div>
            <div className="Rights_3">
                USERS Read / Write :
                Max, Louis
            </div>
            <div className="Rights_2">

                USERS Read / Write :
                Louis
            </div>
            <div className="Rights_1">
                USERS Read / Write :
                Vincent
                
                <img src="./huile.svg" />
                </div>
            <div className="Infos">
                <b>Building Beaubourg, centre Georges Pompidou.</b>
                <br />
                <img src="./centre.jpg" />
                <br />
                Digital Twin topologie : (Monde &gt; France &gt; Paris)
            </div>
        </div>
    </>
};

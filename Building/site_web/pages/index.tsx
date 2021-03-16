import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import drawerSetContentAction from "../src/actions/drawer/drawerSetContent";
import drawerToggleAction from "../src/actions/drawer/drawerToggleAction";
import drawerSetTitleAction from "../src/actions/drawer/drawerSetTitle";
import elementsIndicatorMap from '../src/utils/ElementsIndicatorMap';
import ImageMap from 'image-map';
import { GlobalState } from "../src/types/globalState";
import { ImageType, StatusItem } from "../src/types/datas";
import changeStatusToDrawerContent from "../src/utils/changeStatusToDrawerContent";
import '../src/styles/index.scss'
import { BancZoom } from "../src/components/Main/BancZoom";
import { BancGeneral } from "../src/components/Main/BancGeneral";
import DescriptionProjet from "../src/components/Main/DescriptionProjet";


export default function index() {
    const dispatch = useDispatch();
    const [title, setTitle] = useState("");
    const statusList = useSelector<GlobalState, StatusItem[]>((state) => state.datas.status.status);
    const images = useSelector<GlobalState, ImageType>((state) => state.datas.images);

    useEffect(() => {
        // Pour que les coordonnées sur l'image map soient responsives.
        ImageMap("img[usemap]");
    });

    //@ts-ignore (Conflit dans la définition de type node).
    const handleClickArea = (e: MouseEvent<HTMLAreaElement, MouseEvent>) => {
        e.preventDefault();
        const composantName = e.target.id;
        const indicatorListForDrawer = elementsIndicatorMap[composantName];
        const status = statusList.filter((x) => indicatorListForDrawer.includes(x.ObjName))
        
        dispatch(drawerSetTitleAction(title));
        dispatch(drawerSetContentAction(changeStatusToDrawerContent(status)));
        dispatch(drawerToggleAction(true));
    }

    const messageBase = "Sélectionnez la zone à inspecter"
    return <>
        <h1 style={{ textAlign: "center" }}>{title.length > 0 ? messageBase + " : " + title : messageBase}</h1>
        <div className="grid-container">
            <BancGeneral setTitle={setTitle} engrenagePicture={images.engrenagePicture} handleClickArea={handleClickArea}></BancGeneral>
            <BancZoom setTitle={setTitle} zoomEngrenagePicture={images.zoomEngrenagePicture} handleClickArea={handleClickArea}></BancZoom>
        </div>
        <DescriptionProjet />
    </>
};

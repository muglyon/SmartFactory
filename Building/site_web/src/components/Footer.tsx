import { AppBar } from "@material-ui/core";
import { useSelector } from "react-redux";
import { ImageType, ProjectList } from "../types/datas";
import { GlobalState } from "../types/globalState";

export default function Footer() {
    const currentProject = useSelector<GlobalState, ProjectList | null>((state) => state.datas.CET.current ? state.datas.CET.current : null);
    const images = useSelector<GlobalState, ImageType>((state) => state.datas.images);

    return <AppBar style={{ background: 'white', color: 'black' }} position="fixed" className="footer">


        <div className="footer-date">
            Dernière donnée : {currentProject && currentProject.time ? new Date(currentProject.time).toLocaleString() : "/"}
        </div>


        <div className="footer-image">
            Images : ref_{images.engrenagePicture}_{images.zoomEngrenagePicture}
        </div>



    </AppBar>
}
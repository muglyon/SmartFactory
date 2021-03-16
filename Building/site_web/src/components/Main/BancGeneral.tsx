import { EnergyData } from "./EnergyData";

export function BancGeneral(props) {

    return (<div>
        <div className="generalTitle"><b>Etat de santé des composants du banc éolien</b></div>
        <div className="generalEnergy"><EnergyData /></div>
        <div className="generalImage">
            <img style={{
                width: "100%",
                height: "auto"
            }} src={`assets/images/${props.engrenagePicture}.jpg`} useMap="#image-map" />

            <map name="image-map">
                <area onMouseEnter={() => props.setTitle("Engrenage Principal")} onClick={props.handleClickArea} id="Engrenage Principal" href="#" coords="430,202,303,277" shape="rect" />
                <area onMouseEnter={() => props.setTitle("Roulement Principal")} onClick={props.handleClickArea} id="Roulement Principal" href="#" coords="646,181,515,248" shape="rect" />
                <area onMouseEnter={() => props.setTitle("Génératrice")} onClick={props.handleClickArea} id="Génératrice" href="#" coords="228,215,56,306" shape="rect" />
            </map>
        </div>



    </div>

    );
}

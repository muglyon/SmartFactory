import { useSelector } from "react-redux";
import { GlobalState } from "../../types/globalState";
import { EnergyItem } from "../../types/datas";
import { VerticalAlignBottom, VerticalAlignTop, VerticalAlignCenter } from "@material-ui/icons";
import InfoTooltip from "../InfoTooltip";

export function EnergyData() {
    const energy = useSelector<GlobalState, EnergyItem[]>((state) => state.datas.status.energy);
    const input = energy && energy.length > 0 ? energy[0].input_energy : 0;
    const output = energy && energy.length > 0 ? energy[0].output_energy : 0;
    const ratio = energy && energy.length > 0 ? (energy[0].output_energy / energy[0].input_energy) * 100 : 0;
    return (<>
        <span className="output"><VerticalAlignTop />Energie de sortie : {output.toFixed(2)} kW/h <InfoTooltip title="lorem ipsum"/></span>

        <span className="ratio"><VerticalAlignCenter /> Rendement : {ratio.toFixed(1)}% <InfoTooltip title="lorem ipsum"/></span>

        <span className="input"><VerticalAlignBottom /> Energie d'entrée : {input.toFixed(2)} kW/h <InfoTooltip title="lorem ipsum"/></span>
    </>
    );
}

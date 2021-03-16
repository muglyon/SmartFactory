import { useSelector } from "react-redux";
import { GlobalState } from "../../types/globalState";
import { ProjectList } from "../../types/datas";
import { Box } from "@material-ui/core";

export default function DescriptionProjet() {
    const project = useSelector<GlobalState, ProjectList | undefined>((state) => state.datas.CET.current);
    if (project) {
        const splittedCETEssai = project.CETEssai.split(' - ')
        const CET = splittedCETEssai[0]
        const essai = splittedCETEssai[1]
        return <Box border={1} className="projectDescription">
            Description du projet {CET} - Essai {essai} : lorem ipsum
        </Box>
    } else return null
}

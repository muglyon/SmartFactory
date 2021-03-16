import { ProjectList, ProjectListSetCurrent } from "../../types/datas";

export default function currentDataAction(current: ProjectList): ProjectListSetCurrent {
    return {
        type: "PROJECT_LIST_CURRENT",
        current
    };
}
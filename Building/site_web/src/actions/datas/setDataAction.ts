import { ProjectList, ProjectListSetAction } from "../../types/datas";

export default function setDataAction(projectList: ProjectList[]): ProjectListSetAction {
    return {
        type: "PROJECT_LIST_SET",
        projectList
    }
}
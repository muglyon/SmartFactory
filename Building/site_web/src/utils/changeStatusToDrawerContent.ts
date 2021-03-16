import { StatusItem } from "../types/datas";
import { DrawerContent } from "../types/Drawer";

const statusEnum = {
    undefined: "grey",
    "": "grey",
    "nd": "grey",
    "good": "green",
    "bad": "red",
    "green": "green",
    "red": "red",
    "Surveillance": "green",
    "Apprentissage": "green",
    "Validation": "green",
    "Alarme": "red",
}

export default function changeStatusToDrawerContent(status: StatusItem[]): DrawerContent[] {
    return status.map((x) => {
        return {
            label: x.ObjName,
            name: x.name,
            state: x.status 
                ? statusEnum[x.status] 
                : x.mode 
                    ? statusEnum[x.mode] 
                    : statusEnum.undefined
        }
    })
}

import { ImageType, StatusItem, StatusMapping } from '../types/datas'
import changeStatusToDrawerContent from './changeStatusToDrawerContent'
import elementIndicatorMap from './ElementsIndicatorMap'

export default function getImageNameByStatusItems(items: StatusItem[]): ImageType {
    const status: StatusMapping = {
        'Roulement Principal': "vert",
        'Engrenage Principal': "vert",
        'Génératrice': "vert",
        'Engrenage-Pignon': "vert",
        'Engrenage-Roue': "vert"
    }
    // Tous les indicateurs sont verts par défaut
    // Si une des valeurs liées à une clé d'un indicateur n'est pas correct, on modifie l'indicateur en conséquence
    Object.keys(elementIndicatorMap).forEach((key) => {
        
        let result = "vert"
        const subItems = items.filter((x) => elementIndicatorMap[key].some((subKey) => subKey !== "OCSVM global" && x.ObjName.startsWith(subKey)))

        const statusList = changeStatusToDrawerContent(subItems)
        if (statusList.some((x) => x.state == "grey")) result = "gris"
        else if (statusList.some((x) => x.state == "red")) result = "rouge"

        status[key] = result
    })
    return getImage(status)
}

export function getImage(statusList: StatusMapping): ImageType {
    // We do it manually because Object.value cause a bad sorting
    const code = [
        statusList['Engrenage Principal'][0],
        statusList['Roulement Principal'][0],
        statusList.Génératrice[0],
        statusList['Engrenage-Pignon'][0],
        statusList['Engrenage-Roue'][0]
    ]
    const mainImageCode = code.slice(0, 3).join('')
    const zoomImageCode = code.slice(3).join('')
    return {
        engrenagePicture: mainImageCode.includes('g') ? 'scen0' : mainImageMapper[mainImageCode],
        zoomEngrenagePicture: zoomImageCode.includes('g') ? 'scenA' : zoomImageMapper[zoomImageCode]
    }

}

const mainImageMapper = {
    "vvv": "scen1",
    "rrr": "scen2",
    "vrr": "scen3a",
    "rvr": "scen3b",
    "rrv": "scen3c",
    "vvr": "scen4c",
    "vrv": "scen4b",
    "rvv": "scen4a"
}

const zoomImageMapper = {
    "vv": "scenE",
    "rr": "scenD",
    "vr": "scenB",
    "rv": "scenC"
}
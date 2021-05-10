import { DrawerAction, DrawerState } from "../types/Drawer";

const drawerInitState: DrawerState = {
    open: false,
    title: "",
    content: []
}

export default function drawerReducer(state: DrawerState = drawerInitState, action: DrawerAction) {
    switch (action.type) {
        case "DRAWER_TOGGLE_ACTION":
            return {
                ...state,
                open: action.open
            };
        case "DRAWER_SET_CONTENT":
            return {
                ...state,
                content: action.content
            };
        case "DRAWER_SET_TITLE":
            return {
                ...state,
                title: action.title
            };
        default:
            return state;
    }
}
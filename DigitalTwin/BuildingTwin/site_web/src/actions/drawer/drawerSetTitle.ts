import {  DrawerSetTitleAction } from "../../types/Drawer";

export default function drawerSetTitleAction(title: string): DrawerSetTitleAction {
    return {
        type: "DRAWER_SET_TITLE",
        title
    };
}
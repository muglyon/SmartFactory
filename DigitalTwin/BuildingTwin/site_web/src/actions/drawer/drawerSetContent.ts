import { DrawerContent, DrawerSetContentAction } from "../../types/Drawer";

export default function drawerSetContentAction(content: DrawerContent[]): DrawerSetContentAction {
    return {
        type: "DRAWER_SET_CONTENT",
        content
    };
}
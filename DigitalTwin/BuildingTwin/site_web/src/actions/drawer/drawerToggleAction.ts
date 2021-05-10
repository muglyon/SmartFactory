import { DrawerToggleAction } from "../../types/Drawer";

export default function drawerToggleAction(open: boolean): DrawerToggleAction {
    return {
        type: "DRAWER_TOGGLE_ACTION",
        open
    };
}
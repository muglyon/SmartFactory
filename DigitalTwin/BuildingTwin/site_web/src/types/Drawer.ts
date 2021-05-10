export interface DrawerState {
    open: boolean;
    title: string;
    content: DrawerContent[];
}

export type DrawerAction = DrawerToggleAction | DrawerSetContentAction | DrawerSetTitleAction;

export interface DrawerToggleAction {
    type: "DRAWER_TOGGLE_ACTION";
    open: boolean;
}

export interface DrawerSetContentAction {
    type: "DRAWER_SET_CONTENT";
    content : DrawerContent[];
}

export interface DrawerSetTitleAction {
    type: "DRAWER_SET_TITLE";
    title : string;
}

export interface DrawerContent {
    label: string;
    state: "red" | "green" | "grey";
    name: string;
}
export interface ModalState {
    component: JSX.Element | null;
    open: boolean; 
}

export interface HandleModalAction {
    type: "HANDLE_MODAL";
    open: boolean;
    component: JSX.Element | null;
}
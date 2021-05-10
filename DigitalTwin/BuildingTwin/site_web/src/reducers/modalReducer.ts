import { ModalState, HandleModalAction } from '../types/Modal';

const initial: ModalState = {
    component: null,
    open: false
}

export type ModalAction = HandleModalAction

export default function modalReducer(state = initial, action: ModalAction) {
    switch(action.type) {
        case "HANDLE_MODAL":
            return {
                ...state,
                component: action.component,
                open: action.open
            };
        default:
            return state;
    }
}

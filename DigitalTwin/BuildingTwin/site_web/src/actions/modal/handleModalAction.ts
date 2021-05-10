import { HandleModalAction } from '../../types/Modal';

export default function handleModalAction(open: boolean, component: JSX.Element | null): HandleModalAction {
    return {
        type: "HANDLE_MODAL",
        component,
        open
    };
}

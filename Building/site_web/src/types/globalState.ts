import { ModalState } from './Modal';
import { DrawerState } from './Drawer';
import { ProjectListState } from './datas';

export interface GlobalState {
    modal: ModalState;
    drawer: DrawerState;
    datas: ProjectListState;
}
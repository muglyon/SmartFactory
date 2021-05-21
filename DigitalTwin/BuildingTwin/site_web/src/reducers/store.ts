import { createStore, combineReducers } from "redux";
import modal from "./modalReducer";
import drawer from './drawerReducer';
import datas from './datasReducer';

import { createWrapper } from 'next-redux-wrapper';

const allReducers = combineReducers({
    modal,
    drawer,
    datas
});

const store = () => createStore(allReducers);

export default createWrapper(store);

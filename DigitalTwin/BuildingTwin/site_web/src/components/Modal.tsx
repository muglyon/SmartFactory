import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { GlobalState } from '../types/globalState';
import handleModalAction from '../actions/modal/handleModalAction';
import * as React from 'react'

const useStyle = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    paper: {
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3)
    }
}));

export default function SmartFactoModal() {

    const classes = useStyle();

    const open = useSelector((state: GlobalState) => state.modal.open);
    const Component = useSelector((state: GlobalState) => state.modal.component);

    const dispatch = useDispatch();
    const handleModalActionClose = () => dispatch(handleModalAction(false, null));


    return <Modal open={open} className={classes.modal} onClose={handleModalActionClose}>
        <Paper className={classes.paper}>
            {
                Component
                    ? Component 
                    : null
            }
        </Paper>
    </Modal>
}

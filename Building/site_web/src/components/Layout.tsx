import { useEffect, ReactElement, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthentifiedProps } from '../types/Auth';
import { AppBar, Toolbar, IconButton, TextField, Box, CircularProgress } from '@material-ui/core';
import { ExitToApp, Home, Menu, Info } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { withRouter } from 'next/router';
import { GlobalState } from '../types/globalState';
import drawerToggleAction from "../actions/drawer/drawerToggleAction";
import currentDataAction from "../actions/datas/currentDataAction";
import setGraphData from "../actions/datas/setGraphData";
import setDataAction from "../actions/datas/setDataAction";
import Link from 'next/link'
import DatabaseService from "../service/Database.service";
import { ProjectList } from "../types/datas";
import setStatusAction from "../actions/datas/setStatus";
import ActiveLink from './ActiveLink'
import "../styles/Layout.scss";
import { DrawerList } from "./DrawerList";
import Footer from "./Footer";

function Layout(props: AuthentifiedProps & { children: ReactElement }) {
    const projectList = useSelector<GlobalState, ProjectList[] | undefined>((state) => state.datas.CET.list);
    const projectListCurrent = useSelector<GlobalState, ProjectList | null>((state) => state.datas.CET.current ? state.datas.CET.current : null);
    const dispatch = useDispatch();
    const loading = projectList == undefined;
    const handleCETChange = (project: ProjectList) => {
        dispatch(setGraphData([]))
        dispatch(currentDataAction(project))
        DatabaseService.queryStatusByCET(project.CETEssai, project.time).then((values) => {
            dispatch(setStatusAction(values))
        })
    }

    useEffect(() => {
        // Récupérer les numéro d'essais et les mettres dans le store redux.
        DatabaseService.queryCET().then((values) => {
            dispatch(setDataAction(values));
        })
    }, [])

    return <div className="layout">
        <AppBar style={{ background: 'white', color: 'black' }}>
            <Toolbar disableGutters className="app-bar">
                <IconButton onClick={() => dispatch(drawerToggleAction(true))}>
                    <Menu />
                </IconButton>
                <Box>
                    <Link href="/">
                        <a>
                            <img src="./logo.png" className=" d-none d-block-md logo "></img>
                        </a>
                    </Link>
                </Box>
                <li key="separatorImage" className="item-separator-custom"></li>
                <ActiveLink href="/" className="link" activeClassName="selected-tab" key="link-home">
                    <a>
                        <span className="icon"><Home /></span>
                        <span className="caption">Accueil</span>
                    </a>
                </ActiveLink>

                <li key="separatorUser" className="item-separator-custom"></li>
                <Box className="userInfos" >
                    <span className="vl"></span>
                    <span className="caption">{props.userName}</span>
                    <a className="user-logout" href='/logout'><ExitToApp /></a>
                </Box>
            </Toolbar>

        </AppBar>

        <div className="content">
            {props.children}
        </div>
        <DrawerList />
        <Footer />
    </div>
};

export default withRouter(Layout)
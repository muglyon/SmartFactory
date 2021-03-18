import { ReactElement } from "react";
import { useDispatch } from "react-redux";
import { AuthentifiedProps } from '../types/Auth';
import { AppBar, Toolbar, IconButton, Box } from '@material-ui/core';
import { Home, Menu, Assistant, Explore, CloudUpload, Category, Functions, Airplay } from '@material-ui/icons';
import { withRouter } from 'next/router';
import drawerToggleAction from "../actions/drawer/drawerToggleAction";
import Link from 'next/link'
import ActiveLink from './ActiveLink'
import "../styles/Layout.scss";
import { DrawerList } from "./DrawerList";

function Layout(props: AuthentifiedProps & { children: ReactElement }) {

    const dispatch = useDispatch();



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
                <li key="separatorTwin" className="item-separator-custom"></li>
                <ActiveLink href="/twinDevices" className="link" activeClassName="selected-tab" key="link-twin">
                    <a>
                        <span className="icon"><CloudUpload /></span>
                        <span className="caption">Twin Device</span>
                    </a>
                </ActiveLink>
                <li key="separatorRemote" className="item-separator-custom"></li>
                <ActiveLink href="/remote" className="link" activeClassName="selected-tab" key="link-remote">
                    <a>
                        <span className="icon"><Assistant /></span>
                        <span className="caption">Remote assistance</span>
                    </a>
                </ActiveLink>

                <li key="separatorData" className="item-separator-custom"></li>
                <ActiveLink href="/dataexplorer" className="link" activeClassName="selected-tab" key="link-explore">
                    <a>
                        <span className="icon"><Explore /></span>
                        <span className="caption">Digital twin Explorer</span>
                    </a>
                </ActiveLink>
                <li key="separatorMapping" className="item-separator-custom"></li>
                <ActiveLink href="/mapping" className="link" activeClassName="selected-tab" key="link-mapping">
                    <a>
                        <span className="icon"><Airplay /></span>
                        <span className="caption">Mapping 3D</span>
                    </a>
                </ActiveLink>
                <li key="separatorpredict" className="item-separator-custom"></li>
                <ActiveLink href="/prediction" className="link" activeClassName="selected-tab" key="link-predict">
                    <a>
                        <span className="icon"><Category /></span>
                        <span className="caption">Analyse prédictive</span>
                    </a>
                </ActiveLink>
                <li key="separatorFormules" className="item-separator-custom"></li>
                <ActiveLink href="/formules" className="link" activeClassName="selected-tab" key="link-formule">
                    <a>
                        <span className="icon"><Functions /></span>
                        <span className="caption">Formules</span>
                    </a>
                </ActiveLink>
            </Toolbar>

        </AppBar>

        <div className="content">
            {props.children}
        </div>
        <DrawerList />
    </div>
};

export default withRouter(Layout)
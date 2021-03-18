import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import drawerToggleAction from "../actions/drawer/drawerToggleAction";
import setGraphData from "../actions/datas/setGraphData";
import { DrawerContent } from "../types/Drawer";
import formatParams from "../utils/formatParams";
import { Drawer, List, ListItem, ListItemIcon } from '@material-ui/core';
import { GlobalState } from "../types/globalState";
import { ArrowBack } from "@material-ui/icons";

export function DrawerList(props) {
    const router = useRouter();
    const dispatch = useDispatch();


    const drawerTitle = useSelector<GlobalState, string>((state) => state.drawer.title);
    const drawerOpenState = useSelector<GlobalState, boolean>((state) => state.drawer.open);
    const drawerContent = useSelector<GlobalState, DrawerContent[]>((state) => state.drawer.content);

    const handleListItem = (route: string) => {
        router.push(route);
        dispatch(setGraphData([]))
        dispatch(drawerToggleAction(false));
    };

    return <>
        <Drawer open={drawerOpenState} onClose={() => dispatch(drawerToggleAction(false))}>
            <List style={{ minWidth: "20vw" }}>
                <ListItem button divider
                    onClick={() => handleListItem("/")}>
                    <span className="icon"><ArrowBack /></span>
                    <span className="caption">About {drawerTitle}</span>
                </ListItem>
                {
                    drawerContent.length > 0 ? drawerContent.map((content) => <ListItem key={content.label}
                        button
                        divider
                        onClick={() => handleListItem("/chart" + formatParams({
                            name: content.name
                        }))}
                    >
                        <ListItemIcon>
                            <svg width="24" height="24">
                                <circle cx="12" cy="12" r="12" fill={content.state} />
                            </svg>
                        </ListItemIcon>
                        {content.label}
                    </ListItem>) :
                        <ListItem divider>
                            Projet de démonstration d'Azure Digital Twin <br/>
                            Par Louis, Vincent et Maxime <br/>
                            Pour le magazine Programmez!
                        </ListItem>
                }
            </List>
        </Drawer>
    </>
}
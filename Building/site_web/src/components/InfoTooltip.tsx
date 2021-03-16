import { Tooltip } from "@material-ui/core";
import { Info } from "@material-ui/icons";

export default function InfoTooltip(props: { title: string }) {
    return <Tooltip title={props.title} placement="top">
        <Info style={{ fontSize: 15 }} />
    </Tooltip>
}

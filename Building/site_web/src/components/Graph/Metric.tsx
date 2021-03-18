import { Box, BoxProps, makeStyles } from '@material-ui/core';
import { FunctionComponent } from 'react';
import { DoneOutline as DoneOutlineIcon, ErrorOutline as ErrorOutlineIcon } from '@material-ui/icons';

const useStyle = makeStyles(theme => ({
    metric: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: "center",
        // justifyContent: "space-between",
        background: '#EDF1F7',
        padding: '.5em'
    },
    icon: {
        textAlign: 'right',
        width: '100%',
    },
    success: {
        color: '#24A600',
    },
    warning: {
        color: '#CB0538',
    },
    value: {
        color: "#314668",
        fontSize: '3vh',
        wordBreak: "break-word",
        textAlign: 'center'
    },
    valueIcon: {
        "& svg": {
            fontSize: '4rem'
        }
    },
    label: {
        color: "#314668",
        textAlign: 'center'
    }
}));

type MetricProps = {
    value?: number | string,
    label: string | number,
    isOk?: boolean;
}

const Metric: FunctionComponent<MetricProps & BoxProps> = (props) => {
    
    const classes = useStyle();
    const icon = props.isOk === undefined ? undefined : props.isOk ? <DoneOutlineIcon /> : <ErrorOutlineIcon />
    const iconClass = props.isOk ? classes.success : classes.warning;
    const hasValue: boolean = props.value !== undefined;
    const className = props.className

    return <Box className={classes.metric + " " + className} justifyContent={'center'}>
        {hasValue ? <div className={`${classes.icon} ${iconClass}`}>{icon} </div> : undefined}
        {hasValue ?
            <div className={classes.value}>{props.value}</div> :
            <div className={`${classes.valueIcon} ${iconClass}`}>{icon}</div>
        }
        <div className={classes.label}>{props.label}</div>
    </Box>
}


export default Metric;
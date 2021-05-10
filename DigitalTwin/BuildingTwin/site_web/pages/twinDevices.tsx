import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { GlobalState } from "../src/types/globalState";
import TwinService from "../src/service/Twin.service";
import setDeviceTwin from "../src/actions/datas/setDeviceTwin";
import '../src/styles/index.scss'
import TextField from '@material-ui/core/TextField';
import { Button, Checkbox, FormControlLabel, MenuItem } from "@material-ui/core";

// import Thermometer from 'react-thermometer-component'

export default function index() {
    const dispatch = useDispatch();
    const twinData = useSelector<GlobalState, any>((state) => state.datas.deviceTwin);
    const [hall, setHall] = useState("None");
    const [twinPatch, setTwinPatch] = useState({})

    const halls = ["None", "Hall_01", "Hall_02", "Hall_03"]
    const handleChange = (event) => {
        const value = event.target.value
        setHall(value);
        setTwinPatch({});
        if (value !== "None") {
            TwinService.getDeviceTwin(value).then((twin) => {
                dispatch(setDeviceTwin(twin));
                setTwinPatch(twin)
            })
        }
    };

    return <div>
        <TextField
            id="standard-select-twin"
            select
            label="Select Hall"
            value={hall}
            onChange={handleChange}
            helperText="Please select a hall"
        >
            {halls.map((option) =>
                <MenuItem key={option} value={option}>
                    {option}
                </MenuItem>
            )}
        </TextField>

        {hall !== "None" ?

            <div>
                <div>
                    <Number onChange={(event) => {
                        const intValue = parseInt(event.target.value)
                        setTwinPatch({
                            ...twinPatch,
                            targetTemp: intValue
                        })
                    }} value={twinPatch["targetTemp"]} twinKey="targetTemp" />
                </div>

                <div>
                    <Number onChange={(event) => {
                        const intValue = parseInt(event.target.value)
                        setTwinPatch({
                            ...twinPatch,
                            length: intValue
                        })
                    }} value={twinPatch["length"]} twinKey="length" />
                </div>

                <div>
                    <Number onChange={(event) => {
                        const intValue = parseInt(event.target.value)
                        setTwinPatch({
                            ...twinPatch,
                            width: intValue
                        })
                    }} value={twinPatch["width"]} twinKey="width" />
                </div>

                <div>
                    <Number onChange={(event) => {
                        const intValue = parseInt(event.target.value)
                        setTwinPatch({
                            ...twinPatch,
                            height: intValue
                        })
                    }} value={twinPatch["height"]} twinKey="height" />
                </div>

                <div>
                    <Boolean onChange={(event) => {
                        setTwinPatch({
                            ...twinPatch,
                            isEscalatorRun: event.target.checked
                        })
                    }} value={twinPatch["isEscalatorRun"]} twinKey="isEscalatorRun" />
                </div>

                <div>
                    <Boolean onChange={(event) => {
                        setTwinPatch({
                            ...twinPatch,
                            isLightRun: event.target.checked
                        })
                    }} value={twinPatch["isLightRun"]} twinKey="isLightRun" />
                </div>

                <div>
                    <Text onChange={(event) => {
                        setTwinPatch({
                            ...twinPatch,
                            climVersion: event.target.value
                        })
                    }} value={twinPatch["climVersion"]} twinKey="climVersion" />
                </div>

                <Button variant="contained" color="primary" onClick={() => {
                    TwinService.setDeviceTwin(hall, twinPatch)
                }}>
                    Valider
                </Button>
            </div>
            : null}
    </div>
};

function Text(props: any) {
    return <TextField style={{ width: "50%" }} onChange={props.onChange}
        key={props.twinKey} label={props.twinKey} value={props.value} InputLabelProps={{
            shrink: true,
        }} />
}

function Number(props: any) {
    return <TextField style={{ width: "50%" }} type="number" onChange={props.onChange}
        key={props.twinKey} label={props.twinKey} value={props.value} InputLabelProps={{
            shrink: true,
        }} />
}

function Boolean(props: any) {
    console.log(props)
    return <FormControlLabel
        control={<Checkbox style={{ width: "50%" }} onChange={props.onChange}
            key={props.twinKey} checked={props.value == undefined ? false : props.value} />}
        label={props.twinKey}
        labelPlacement="start"
    />
}
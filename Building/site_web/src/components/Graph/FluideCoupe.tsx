import { Box, makeStyles } from '@material-ui/core';
import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { GlobalState } from '../../types/globalState';
import Metric from './Metric';

const useStyle = makeStyles(theme => ({
    grid: {
        "display": "grid",
        "grid-template-columns": "1fr 1fr 1fr",
        "column-gap": "12px",
        "margin-bottom": " 12px",
        height: "30%",
        "& > div": {
            minWidth: 0
        }
    },
    title: {
        margin: 0,
    }
}));

const FluideCoupe: FunctionComponent = () => {

    const Temperature = useSelector((state: GlobalState) => state.datas && state.datas.huile && state.datas.huile.Temperature ? state.datas.huile.Temperature : [])
    const Viscosité_dynamique = useSelector((state: GlobalState) => state.datas && state.datas.huile && state.datas.huile.Viscosité_dynamique ? state.datas.huile.Viscosité_dynamique : [])
    const measure100 = useSelector((state: GlobalState) => state.datas && state.datas.huile && state.datas.huile["100_µm"] ? state.datas.huile["100_µm"] : [])
    const measure200 = useSelector((state: GlobalState) => state.datas && state.datas.huile && state.datas.huile["200_µm"] ? state.datas.huile["200_µm"] : [])
    const classes = useStyle();


    const temp = Temperature.length > 0 ? Temperature[Temperature.length - 1] : 0
    const visco = Viscosité_dynamique.length > 0 ? Viscosité_dynamique[Temperature.length - 1] : 0
    const nb100 = measure100.length > 0 ? measure100[measure100.length - 1] : 0
    const nb200 = measure200.length > 0 ? measure200[measure200.length - 1] : 0
    const nbPart = nb100 + nb200
    const isTempOk = temp < 26
    const isViscoOk = visco < 30
    const isFiltreOk = nbPart < 10
    return <div style={{ height: "100%" }}>
        <h4 className={classes.title}>Qualité du fluide</h4>
        <Box className={classes.grid}>
            <Metric label="Température °C" value={temp.toFixed(1)} isOk={isTempOk} />
            <Metric label="Viscosité mm²/s" value={visco.toFixed(1)} isOk={isViscoOk} />
            <Metric label="nb particules > 100μm" value={nbPart} isOk={isFiltreOk} />
        </Box>

        <h4 className={classes.title}>Action nécessaire</h4>
        <Box className={classes.grid}>
            <Metric label="Refroidissement" isOk={isTempOk} />
            <Metric label="Vidange" isOk={isViscoOk || isFiltreOk} />
            <Metric label="Filtration" isOk={isFiltreOk} />
        </Box>

        <h4 className={classes.title}>Consommation du fluide</h4>

        <Box className={classes.grid}>
            <Metric label="Consommation l/j" value={27} isOk={true} />
            <Metric label="Niveau d'huile" value="70%" isOk={true} />
            <Metric label="Débit arrosage l/min" value={8} isOk={true} />
        </Box>


    </div>


}

export default FluideCoupe
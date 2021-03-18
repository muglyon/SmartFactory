import dynamic from 'next/dynamic'
// import { useEffect } from 'react';
import { GlobalState } from '../../types/globalState';
import { useSelector } from "react-redux";

const Plot = dynamic(import('react-plotly.js'), {
    ssr: false
});


export default function ViscoTempGraph(props: any) {
    const temp = useSelector((state: GlobalState) => state.datas && state.datas.huile && state.datas.huile.Temperature ? state.datas.huile.Temperature : [])
    const dates = useSelector((state: GlobalState) => state.datas && state.datas.huile && state.datas.huile.Temperature ? state.datas.huile.timestamp : [])
    const visco = useSelector((state: GlobalState) => state.datas && state.datas.huile && state.datas.huile.Viscosité_dynamique ? state.datas.huile.Viscosité_dynamique : [])

    const layout = {
        "showlegend": true,
        // "autosize": true,
        width: window.innerWidth * 0.4,
        height: window.innerHeight * 0.4,
        // "margin": {
        //     "b": 30,
        //     "l": 50,
        //     "r": 50,
        //     "t": 10
        // },

        title: "Température et Viscosité dynamique"
    }
    let config: any;
    // const dispatch = useDispatch()

    if (temp.length > 0 && visco.length > 0) {

        const tempGraph: Plotly.Data = {

            x: dates,
            y: temp,
            type: 'scatter',
            name: 'Température'

        }

        const viscoGraph: Plotly.Data = {

            x: dates,
            y: visco,
            type: 'scatter',
            name: 'Viscosité'

        }

        console.log(temp, dates)
        return <>

            <Plot
                style={{}}
                data={[tempGraph, viscoGraph]}
                onInitialized={(figure) => config = {
                    layout,
                    frames: figure.frames ? figure.frames : undefined,
                    config: {}
                }}
                onUpdate={(figure) => {
                    config = {
                        layout: {
                            ...figure.layout,
                        },
                        frames: figure.frames ? figure.frames : undefined,
                        config: {}
                    }
                }}
                layout={config ? config.layout : layout}

                frames={config ? config.frames : []}
                config={config ? config.config : {}}

            />
        </>
    } else return null;


}
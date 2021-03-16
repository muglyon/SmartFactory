import * as React from 'react'
import { SVMData } from '../../types/datas'
import splitSVMata from '../../utils/datas/splitSVMData';
import dynamic from 'next/dynamic'
import { GlobalState } from '../../types/globalState';
import { useSelector } from 'react-redux';

const Plot = dynamic(import('react-plotly.js'), {
    ssr: false
});
export interface GraphSVMProps {
    datas: SVMData[]
}

export default function GraphSVM(props: GraphSVMProps) {

    const title = useSelector<GlobalState, string>((state) => state.drawer.title);
    const { blue, red, green, grey, cyan } = splitSVMata(props.datas)
    if (process.browser) {
        return <>
            <Plot
                data={[
                    {
                        type: 'scattergl',
                        mode: 'markers',
                        marker: {
                            color: "blue"
                        },
                        y: blue.map((x) => x.y),
                        x: blue.map((x) => new Date(x.time)),
                        name: "Apprentissage"
                    },
                    {
                        type: 'scattergl',
                        mode: 'markers',
                        marker: {
                            color: "cyan"
                        },
                        y: cyan.map((x) => x.y),
                        x: cyan.map((x) => new Date(x.time)),
                        name: "Validation"
                    },
                    {
                        type: 'scattergl',
                        mode: 'markers',
                        marker: {
                            color: "red"
                        },
                        y: red.map((x) => x.y),
                        x: red.map((x) => new Date(x.time)),
                        name: "Alarme"
                    },
                    {
                        type: 'scattergl',
                        mode: 'markers',
                        marker: {
                            color: "green"
                        },
                        y: green.map((x) => x.y),
                        x: green.map((x) => new Date(x.time)),
                        name: "Surveillance"
                    },
                    {
                        type: 'scattergl',
                        mode: 'markers',
                        marker: {
                            color: "grey"
                        },
                        y: grey.map((x) => x.y),
                        x: grey.map((x) => new Date(x.time)),
                        name: "Non défini"
                    },
                    {
                        type: "scattergl",
                        mode: "lines",
                        line: {
                            color: "purple"
                        },
                        y: props.datas.map((x) => x.rolling_mean),
                        x: props.datas.map((x) => new Date(x.time)),
                        name: "% anomalies",
                        yaxis: 'y2'
                    }
                ]}
                layout={
                    {
                        width: window.innerWidth * 0.8,
                        height: window.innerHeight * 0.8,
                        title: 'Surveillance par algorithme One-Class SVM : indicateur ' + title,
                        yaxis: { title: 'Distance à la frontière apprise' },
                        yaxis2: { title: 'Pourcentage anomalies (fenêtre glissante)', side: 'right' },
                        xaxis: {
                            title: "Date",
                            autorange: true,
                            // range: [date[0], date[date.length - 1]],
                            // rangeslider: { range: [date[0], date[date.length - 1]] },
                            type: 'date'
                        },
                    }}
            />
        </>
    } else {
        return null;
    }
}
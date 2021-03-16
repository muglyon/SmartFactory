import * as React from 'react'
import { EWMAData } from '../../types/datas'
import splitEWMAData from '../../utils/datas/splitEWMAData';
import dynamic from 'next/dynamic'
import { GlobalState } from '../../types/globalState';
import { useSelector } from 'react-redux';

const Plot = dynamic(import('react-plotly.js'), {
    ssr: false
});

export interface GraphEWMAProps {
    datas: EWMAData[]
}

export default function GraphEWMA(props: GraphEWMAProps) {

    const title = useSelector<GlobalState, string>((state) => state.drawer.title);
    const { blue, red, green, grey } = splitEWMAData(props.datas)
    if (process.browser) {
        return <>
            <Plot
                data={[

                    {
                        type: 'scattergl',
                        mode: 'markers',
                        marker: {
                            color: "grey"
                        },
                        y: grey.map((x) => x.y),
                        x: grey.map((x) => new Date(x.time)),
                        name: "Monitoring inside limits"
                    },
                    {
                        type: 'scattergl',
                        mode: 'markers',
                        marker: {
                            color: "green"
                        },
                        y: green.map((x) => x.y),
                        x: green.map((x) => new Date(x.time)),
                        name: "Monitoring inside limits"
                    },
                    {
                        type: 'scattergl',
                        mode: 'markers',
                        marker: {
                            color: "blue"
                        },
                        y: blue.map((x) => x.y),
                        x: blue.map((x) => new Date(x.time)),
                        name: "Learning Period"
                    },
                    {
                        type: 'scattergl',
                        mode: 'markers',
                        marker: {
                            color: "red"
                        },
                        y: red.map((x) => x.y),
                        x: red.map((x) => new Date(x.time)),
                        name: "Monitoring with alert"
                    },
                    {
                        type: "scattergl",
                        mode: "lines",
                        line: {
                            color: "black"
                        },
                        y: props.datas.map((x) => x.upper),
                        x: props.datas.map((x) => new Date(x.time)),
                        name: "Upper limit thresold"
                    },
                    {
                        type: "scattergl",
                        mode: "lines",
                        line: {
                            color: "black"
                        },
                        y: props.datas.map((x) => x.lower),
                        x: props.datas.map((x) => new Date(x.time)),
                        name: "Lower limit thresold"
                    },
                ]}
                layout={
                    {
                        width: window.innerWidth * 0.8,
                        height: window.innerHeight * 0.8,
                        title: 'Surveillance par algorithme EWMA : indicateur ' + title,
                        yaxis: {
                            title: "Magnitude"
                        },
                        xaxis: {
                            title: "Date",
                            autorange: true,
                            // range: [date[0], date[date.length - 1]],
                            // rangeslider: { range: [date[0], date[date.length - 1]] },
                            type: 'date',

                        },
                    }}
            />
        </>
    } else {
        return null;
    }
}

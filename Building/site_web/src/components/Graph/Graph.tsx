import * as React from 'react'
import dynamic from 'next/dynamic'
import { GlobalState } from '../../types/globalState';
import { useSelector } from 'react-redux';
import { GraphRequest } from '../../types/cosmos';

const Plot = dynamic(import('react-plotly.js'), {
    ssr: false
});

export default function Graph(props: any) {

    const datas = useSelector<GlobalState, GraphRequest[]>((state) => state.datas.graphData);

    if (process.browser) {
        return <>
            <Plot
                data={[

                    {
                        type: 'scattergl',
                        mode: 'lines',
                        marker: {
                            color: "blue"
                        },
                        y: datas.map((x) => x[props.dataKey]),
                        x: datas.map((x) => new Date(x.date)),
                        name: "Monitoring inside limits"
                    }
                ]}
                layout={
                    {
                        width: window.innerWidth * 0.8,
                        height: window.innerHeight * 0.8,
                        title: `Historique ${props.twin} - ${props.dataKey}`,
                        yaxis: {
                            title: props.itemKey
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

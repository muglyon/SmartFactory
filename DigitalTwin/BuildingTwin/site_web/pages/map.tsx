import dynamic from 'next/dynamic'
const DynamicComponentWithNoSSR = dynamic(
    () => import('../src/components/MapProvider'),
    { ssr: false }
)

const map = () => {

    return <DynamicComponentWithNoSSR />
}

map.displayName = "mapping"

export default map;

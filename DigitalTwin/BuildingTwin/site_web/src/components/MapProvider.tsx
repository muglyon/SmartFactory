import { AzureMapsProvider } from 'react-azure-maps'
import MapViewer from './MapViewer';

const MapProvider = () => {


    return <AzureMapsProvider  >
        <MapViewer />
    </AzureMapsProvider>
}

export default MapProvider;

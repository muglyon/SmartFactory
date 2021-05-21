import React, { useContext, useEffect } from 'react'
import { AzureMap, AzureMapsContext, IAzureMapOptions, IAzureMapsContextProps } from 'react-azure-maps'
import { AuthenticationType, ControlPosition } from 'azure-maps-control'
import { control, indoor } from 'azure-maps-indoor'

export default function MapViewer() {
    const subscriptionKey = ""
    const tilesetId = "";
    const statesetId = "";

    const { mapRef } = useContext<IAzureMapsContextProps>(AzureMapsContext) as any
    
    const options: IAzureMapOptions = {
        language: 'fr-FR',
        //use your facility's location
        center: [-122.13203, 47.63645],
        //or, you can use bounds: [# west, # south, # east, # north] and replace # with your map's bounds
        // style: "blank",
        view: 'Auto',
        authOptions: {
            authType: AuthenticationType.subscriptionKey,
            subscriptionKey: subscriptionKey
        },
        zoom: 19,

    }

    let indoorManager;

    useEffect(() => {
        if (mapRef) {
            indoorManager = new indoor.IndoorManager(mapRef, {
                tilesetId,
                statesetId // Optional
            });
            indoorManager.setDynamicStyling(true);

            const levelControl = new control.LevelControl({ position: ControlPosition.TopRight });
            indoorManager.setOptions({ levelControl });

            mapRef.events.add("levelchanged", indoorManager, (eventData) => {

                //code that you want to run after a level has been changed
                console.log("The level has changed: ", eventData);
            });

            mapRef.events.add("facilitychanged", indoorManager, (eventData) => {

                //code that you want to run after a facility has been changed
                console.log("The facility has changed: ", eventData);
            });
        }
    }, [mapRef])
    // useEffect(() => {

    // }, [])

    return <div style={{ height: '700px' }}>
        <AzureMap options={options} controls={[{ controlName: "ZoomControl", options: { position: ControlPosition.BottomRight } }]} />
    </div>
}
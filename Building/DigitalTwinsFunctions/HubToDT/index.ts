import { AzureFunction, Context } from "@azure/functions"
import extractTwins from "./extractTwins";
import DigitalTwinsClient from 'digital-twins-api'

const IoTHubTrigger: AzureFunction = async function (context: Context, message: any): Promise<void> {
    context.log(`Eventhub trigger function called for message array: ${message}`);
    const dt = new DigitalTwinsClient(
        process.env.ENDPOINT
    )

    const device = context.bindingData.systemProperties["iothub-connection-device-id"]

    const items = extractTwins(device, message)

    const cosmosData = []
    Object.keys(items).forEach((key) => {
        dt.updateTwin(key, items[key]).catch((err) => console.error (err))
        
        cosmosData.push({
            twinId: key,
            ...items[key]
        })
    })

    context.bindings.cosmosOutput = JSON.stringify(cosmosData)

    context.log(`new message from ${device} : ${JSON.stringify(items)}`)
};

export default IoTHubTrigger;

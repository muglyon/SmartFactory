import { AzureFunction, Context } from "@azure/functions"
import extractTwins from "./extractTwins";
import DigitalTwinsClient from 'digital-twins-api'

const IoTHubTrigger: AzureFunction = async function (context: Context, messages: any[]): Promise<void> {

    const dt = new DigitalTwinsClient(
        process.env.ENDPOINT
    )
    
    const splittedDatas = []

    context.log(`Eventhub trigger function called for ${messages.length} messages`);
    messages.forEach((message, index) => {

        const device = context.bindingData.systemPropertiesArray[index]["iothub-connection-device-id"]

        const items = extractTwins(device, message)
    
        Object.keys(items).forEach((key) => {
            dt.updateTwin(key, items[key]).catch((err) => console.error (err))
            
            splittedDatas.push({
                twinId: key,
                ...items[key]
            })
        })
    
    })
  };

export default IoTHubTrigger;

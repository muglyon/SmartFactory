import DigitalTwinsClient from 'digital-twins-api'
import { config } from 'dotenv';

async function main() {

  config();

  const dt = new DigitalTwinsClient(process.env.ENDPOINT, process.env.TENANT_ID, process.env.CLIENT_ID, process.env.CLIENT_SECRET)

  console.log(await dt.pushModelsFolder('./assets/models'))
  console.log(await dt.pushModelsFolder('./assets/models/alarms'))

  console.log(await dt.createInstancesFolder('./assets/instances'))

}

main().catch((err) => {
  console.log(err)
  console.log("error code: ", err.code);
  console.log("error message: ", JSON.stringify(err.details));
  console.log("error stack: ", err.stack);
});
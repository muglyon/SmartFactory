import OpcClient from "./OPC/opcClient";
import loggerConfig from './loggerConfig';
import onDataUpdate from "./functions/onDataUpdate";

loggerConfig();


// A modifier en fonction des tests à effectuer.
// Ceci n'est qu'un exemple, utilisez les noeuds de votre serveur OPCUA
const opcClient = new OpcClient({
    // By default we set the Production simulation endpoint.
    EndpointUrl: "opc.tcp://INV011498:4334/UA/SmartFactory", OpcNodes: [
        {
            Id: "ns=1;i=1004",
            DisplayName: "clientDevice.constantVar"
        }
    ]
})

const modificationPayload = {
    "clientDevice.constantVar": 4812
}


// This method mock a call of directMethod DataUpdate in IoTEdge.
onDataUpdate(modificationPayload, opcClient).then((res) => {
    console.log('res  ==>', res);
    process.exit(0);
});
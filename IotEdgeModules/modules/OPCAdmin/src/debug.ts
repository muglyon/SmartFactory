import getEndpointAndNodes from "./getEndpointAndNodes";

// this.getEndpointConfig(this.client, payload.url);

getEndpointAndNodes(
    "opc.tcp://127.0.0.1:4334/UA/SmartFactory", // OPC UA Endpoint
    "ns=1;i=1002", // Device nodeId avec un identifiant string (s=)
    {
            EndpointUrl: "opc.tcp://127.0.0.1:4334/UA/SmartFactory",  // OPC UA Endpoint
            OpcNodes: [{
                DisplayName: "hello.world", // DisplayName présent dans votre pn.json (doit comporter des '.')
                Id: "ns=1;i=1002" // Device nodeId avec un identifiant string (s=)
            }]
    },
    {}
).then((r => {
    console.log('r  ==>', r);
}))
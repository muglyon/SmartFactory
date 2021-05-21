// import { Client, Registry } from "azure-iothub";
// import constantes from '../utils/constantes';
export default class MessageSenderSingleton { }
// class MessageSenderSingleton {
//     private static instance: MessageSenderSingleton;
//     public client: Client;
//     public registry: Registry; 

//     private constructor() {
//         const iotHubConnectionString = KeyVaultSingleton.secretList[constantes.SECRETS.IOTHUB];
//         this.client = Client.fromConnectionString(iotHubConnectionString);
//         this.registry = Registry.fromConnectionString(iotHubConnectionString);

//         if (this.registry) {
//             this.client.open((err) => {
//                 if (err) {
//                     console.error("Could not connect: " + err.message);
//                 } else {
//                     this.client.getFeedbackReceiver(this.receiveFeedback);
//                 }
//             });
//         } else {
//             console.error("Registry connection error.");
//         }
//     }

//     static getInstance() {
//         if (!MessageSenderSingleton.instance) {
//             MessageSenderSingleton.instance = new MessageSenderSingleton();
//         }
//         return MessageSenderSingleton.instance;
//     }

//     public sendToDevice(device: string, moduleName: string, methodName: string, item: object): Promise<DirectMethodResponse> {

//         return new Promise((resolve, reject) => {
//             this.client.invokeDeviceMethod(device, moduleName, {
//                 methodName: methodName,
//                 payload: item,
//                 connectTimeoutInSeconds: 5,
//                 responseTimeoutInSeconds: 5
//             }, (err, res1) => {
//                 if (err) {
//                     reject(err); 
//                 } else { 
//                     resolve(res1);
//                 }
//             });
//         });
//     }

//     private receiveFeedback(err: Error, receiver: Client.ServiceReceiver) {

//         if (err) throw Error(err.message);

//         receiver.on("message", (msg) => {
//             console.log("Feedback message:");
//             console.log(msg.getData().toString("utf-8"));
//         });
//     }

// }


// export default MessageSenderSingleton


import * as signalR from "@microsoft/signalr";
import { Server } from 'socket.io';
import DigitalTwinsSingleton from './DigitalTwinSingleton';
import HuileSimulator from './HuileSimulator';

export default function (io: Server) {

  const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('https://func-signalr-frce.azurewebsites.net/api')
    .build()

  hubConnection.start()
    .then(() => console.log('SignalR Started'))
    .catch(err => console.log('Error connecting SignalR - ' + err));

  hubConnection.on('newMessage', (message) => {
    console.log(message)
    
  });

  DigitalTwinsSingleton.getInstance().dataObservable.subscribe((data) => {
    io.emit('twinData', data)
  })

  setInterval(async () => {
    const data = await HuileSimulator()
    io.emit('huileData', data)
  }, 2000)

}

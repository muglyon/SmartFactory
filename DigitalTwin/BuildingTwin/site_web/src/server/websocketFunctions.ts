
import * as signalR from "@microsoft/signalr";
import { Server } from 'socket.io';
import DigitalTwinsSingleton from './DigitalTwinSingleton';

export default function (io: Server) {

  const endpoint = process.env.SIGNALR_ENDPOINT;

  if (endpoint) {
    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(endpoint)
      .build()

    hubConnection.start()
      .then(() => console.log('SignalR Started'))
      .catch(err => console.log('Error connecting SignalR - ' + err));

    hubConnection.on('newMessage', (message) => {
      console.log(message)
    });
  }
  DigitalTwinsSingleton.getInstance().dataObservable.subscribe((data) => {
    io.emit('twinData', data)
  })






}

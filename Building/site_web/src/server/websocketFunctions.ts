import { Namespace, Server } from 'socket.io';
import { BackMessage } from '../types/SocketProvider';
import DigitalTwinsSingleton from './DigitalTwinSingleton';

export default function (io: Server) {

  DigitalTwinsSingleton.getInstance().dataObservable.subscribe((data) => {
    io.emit('twinData', data)
  })
 
}

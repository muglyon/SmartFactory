import { Server } from 'socket.io';
import DigitalTwinsSingleton from './DigitalTwinSingleton';
import HuileSimulator from './HuileSimulator';

export default function (io: Server) {

  DigitalTwinsSingleton.getInstance().dataObservable.subscribe((data) => {
    io.emit('twinData', data)
  })

  setInterval(async () => {
    const data = await HuileSimulator()
    io.emit('huileData', data)
  }, 2000)

}

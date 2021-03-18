import Device from './devices/Device';
import getDeviceList from './getDeviceList';
import express, { json } from 'express';
import { createServer } from 'http';

const main = async () => {

  const connectionStrings = getDeviceList()
  const deviceArray: Device[] = []

  if (connectionStrings) {
    connectionStrings.forEach((x, i) => {
      const device = new Device(x)
      deviceArray.push(device);
    })
  }


  const app = express()
  app.use(json());


  const intervalFunction = () => {
    deviceArray.forEach(async (x) => {
      x.process();
      x.sendUpdate();
    })
  }

  setInterval(intervalFunction, 1000)

  const server = createServer(app);
  const port = process.env.PORT ? process.env.PORT : 3001;
  server.listen(port, () => {
    console.log('> Ready on http://localhost:' + port)
  });
}

main()
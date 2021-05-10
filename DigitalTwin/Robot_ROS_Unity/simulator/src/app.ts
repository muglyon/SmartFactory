import Device from './devices/Device';
import getDevice from './getDevice';
import express, { json } from 'express';
import { createServer } from 'http';

const main = async () => {

  const connectionString = getDevice()

  if (connectionString) {

    const device = new Device(connectionString)

  }


  const app = express()
  app.use(json());

  const server = createServer(app);
  const port = process.env.PORT ? process.env.PORT : 3000;
  server.listen(port, () => {
    console.log('> Ready on http://localhost:' + port)
  });
}

main()
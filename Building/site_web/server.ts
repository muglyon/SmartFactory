import { config } from 'dotenv';
config();
import verifyEnv from './src/server/src/verifyEnv';
verifyEnv();

import { createServer } from 'http';
import next from 'next';
import express, { json } from 'express';

import cookieParser from "cookie-parser";
import session from "cookie-session";
import bodyParser from 'body-parser';
import expressSession from 'express-session';
import constantes from './src/utils/constantes';
import getGraphData from './src/server/src/getGraphData';
import DigitalTwinsSingleton from './src/server/DigitalTwinSingleton';
import twinSubscribe from './src/server/src/twinSubscribe';
import websocketFunctions from './src/server/websocketFunctions';
import { Server } from 'socket.io';
import getDeviceTwin from './src/server/src/getDeviceTwin';
import setDeviceTwin from './src/server/src/setDeviceTwin';
import DeviceTwinSingleton from './src/server/DeviceTwinSingleton';

const expApp = express();
const server = createServer(expApp);
const io = new Server(server);
const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT ? process.env.PORT : 3000;
const app = next({ dev })
const handle = app.getRequestHandler()


app.prepare().then(async () => {

  DigitalTwinsSingleton.getInstance().init(process.env.TWIN_ENDPOINT as string);
  DeviceTwinSingleton.getInstance();
  
  const twinsIds = [
    "Hall_01", "Hall_02", "Hall_03",
    "Light_01", "Light_02", "Light_03",
    "Clim_01", "Clim_02", "Clim_03",
    "Escalator_01", "Escalator_02", "Escalator_03",
  ]

  twinsIds.forEach((x) => DigitalTwinsSingleton.getInstance().addTwinId(x))

  websocketFunctions(io);
  expApp.use(json());
  expApp.use(cookieParser('SmartFactorySecretParserCode'));
  expApp.use(session({ secret: 'SmartFactorySecretSessionCode' }));
  expApp.use(bodyParser.urlencoded({ extended: true }));
  expApp.use(bodyParser.json());
  expApp.use(expressSession({ secret: 'smartfactory secret of the dead', resave: true, saveUninitialized: false }));

  expApp.get(constantes.URLS.TWIN_SUBSCRIBE, twinSubscribe)
  expApp.get(constantes.URLS.GET_GRAPH_URL, getGraphData)
  expApp.get(constantes.URLS.DEVICE_TWIN, getDeviceTwin)
  expApp.post(constantes.URLS.DEVICE_TWIN, setDeviceTwin)

  expApp.all('*', (req, res) => {

    handle(req, res);

  });

  server.listen(port, () => {
    console.log('> Ready on http://localhost:' + port)
  });



})
import { Mqtt } from 'azure-iot-device-mqtt';
import { ModuleClient, Message } from 'azure-iot-device';
import onDataUpdate from './functions/onDataUpdate';
import { DATA_UPDATE_METHOD_NAME } from './constantes';
import loggerConfig from './loggerConfig';
import { getLogger } from 'log4js';
import onEdgeDataUpdate from './functions/onEdgeDataUpdate';
import OpcManager from './OPC/OpcManager';

loggerConfig();

ModuleClient.fromEnvironment(Mqtt, (moduleConnectionError, client) => {
  const logger = getLogger('DataUpdater');
  if (moduleConnectionError) {
    logger.fatal(moduleConnectionError.message);
    throw moduleConnectionError;
  }

  // connect to the Edge instance
  client.open((connectionError) => {

    if (connectionError) throw connectionError

    logger.info('IoT Hub module client initialized')

    const opcManager = new OpcManager()

    client.onMethod(DATA_UPDATE_METHOD_NAME, (request, response) => onDataUpdate(request, response, opcManager))

    client.on('inputMessage', (inputName, msg) => {
      onEdgeDataUpdate(inputName, msg, opcManager).then(() => {
        client.complete(msg, printResultFor('Receiving message'))
      }).catch((err: Error) => {
        logger.error(err.message);
        client.complete(new Message(err.message), printResultFor('Receiving message'))
      }) 
    })

    client.on('error', function (error: Error) {
      logger.error("Error ==> " + error.message);
      throw error;
    });

    logger.info('now listening method call');

  });
});

function printResultFor(op: string) {
  return function printResult(err: Error, res: any) {
      if (err) {
          console.error(op + ' error: ' + err.toString());
      }
      if (res) {
          console.log(op + ' status: ' + res.constructor.name);
      }
  };
}
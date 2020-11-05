import { Mqtt } from 'azure-iot-device-mqtt';
import { ModuleClient } from 'azure-iot-device';
import DirectMethods from './directsMethods/DirectMethods';
import loggerConfig from './loggerConfig';
import { getLogger } from 'log4js'

ModuleClient.fromEnvironment(Mqtt, function (moduleError, client) {
  loggerConfig();
  const logger = getLogger('OPCAdmin');
  if (moduleError) {
    logger.fatal(moduleError.message);
    throw moduleError;
  } else {
    client.on('error', function (connectionError: Error) {
      logger.fatal(connectionError.message);
      throw connectionError;
    });

    // connect to the Edge instance
    client.open(function (error) {
      if (error) {
        logger.fatal(error.message);
        throw error;
      } else {
        new DirectMethods(client);
        logger.info("Le client OPC-Admin a été initialisé.")
      }
    });

  }
});

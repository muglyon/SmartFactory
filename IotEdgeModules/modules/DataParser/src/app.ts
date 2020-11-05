'use strict';
import { Mqtt as Transport } from 'azure-iot-device-mqtt';
import { ModuleClient } from 'azure-iot-device';
import { Message } from 'azure-iot-device';
import async from 'async';
import { PUBLISHER_MODULE_NAME } from './constantes'
import { PublishedItem, InitialDataInterface } from './types/messageType'
import prepareMessage from './functions/prepareMessage';

let initialData: InitialDataInterface = {};

async.series([

  function (callback) {

    ModuleClient.fromEnvironment(Transport, function (error, client) {
      if (error) {
        callback(error)
      } else {
        client.on('error', function (exception: Error) {
          console.error(exception.message);
        });

        client.open(function (exception) {
          if (exception) {
            callback(exception)
          } else {
            console.log('IoT Hub module client initialized');

            client.on('inputMessage', function (inputName, msg) {
              console.debug('Receive one message on inputMessage');
              pipeMessage(client, inputName, msg);
            });
          }
        });
      }
    });
  }
],
  function (err) {
    if (err) {
      console.error(" failure ", err);
    } else {
      console.info("done!");
    }
    process.exit(1)
  })

function pipeMessage(client: ModuleClient, inputName: string, moduleMessage: Message) {
  client.complete(moduleMessage, printResultFor('Receiving message'));
  var message = moduleMessage.getBytes().toString('utf8');
  var messageBody: PublishedItem[] = Array.isArray(JSON.parse(message)) ? JSON.parse(message) : [JSON.parse(message)];
  if (inputName === PUBLISHER_MODULE_NAME) {
    try {
      if (messageBody) {

        const itemAndDatas = prepareMessage(messageBody, initialData);

        initialData = itemAndDatas.newInitialData;

        const telemetryMessage = {
          type: "telemetry",
          data: itemAndDatas.items
        };

        var outputMsg = new Message(JSON.stringify(telemetryMessage));
        client.sendOutputEvent('output1', outputMsg, printResultFor('Sending received message'));

        client.sendOutputEvent(
          'storageOutput',
          new Message(JSON.stringify(itemAndDatas.items)),
          printResultFor('Sending received message')
        )
      }
    }
    catch (error) {
      console.error("Error", messageBody, error)
    }
  } else {
    console.debug("OTHER SOURCE", inputName)
  }
}

function printResultFor(op: string) {
  return function printResult(err: Error, res: any) {
    if (err) {
      console.error(op + ' error: ' + err.toString());
    }
    if (res) {
      console.info(op + ' status: ' + res.constructor.name);
    }
  };
}

'use strict';
import { Mqtt as Transport } from 'azure-iot-device-mqtt';
import { ModuleClient } from 'azure-iot-device';
import { Message } from 'azure-iot-device';
import { MongoClient, Db } from 'mongodb';
import storeItems from './functions/storeItems';
import async from 'async';
import { PARSER_MODULE_NAME } from './constantes'
import { InitialDataInterface, DataInterface } from './types/messageType'
import * as constantes from './constantes';
import ttlFunctions from './functions/TTLFunctions';

let db: Db;

const collectionList: string[] = [];

let ttlDuration: number = constantes.DEFAULT_TTL

async.series([

  function (callback) {

    MongoClient.connect(
      `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_ADDRESS}:${process.env.MONGO_PORT}?authSource=admin`,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (error, result) => {
        if (error) {
          callback(error)
        } else {
          db = result.db(process.env.MONGO_DATABASE);
          console.info('db initialized');

          callback()
        }
      });
  },

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
              console.log('Receive one message on inputMessage');
              pipeMessage(client, inputName, msg);
            });

            client.getTwin(function (err, twin) {
              if (err) {
                console.error('Error getting twin: ' + err.message);
              } else {
                twin.on('properties.desired', function (delta) {
                  if (delta.TTLDuration) {
                    console.info(`Update TTL to ${delta.TTLDuration}`)
                    ttlDuration = delta.TTLDuration;
                    ttlFunctions.updateTTL(db, ttlDuration)
                  }
                });
              }
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
  var messageBody: DataInterface = JSON.parse(message);
  if (inputName === PARSER_MODULE_NAME) {
    try {
      if (messageBody) {

        Object.keys(messageBody).forEach((key) => {
          if (collectionList.indexOf(key) == -1) {
            ttlFunctions.createTTL(db, key, ttlDuration);
          }
        })

        storeItems(messageBody, db);

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

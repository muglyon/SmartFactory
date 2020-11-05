import { UpdateDataType } from "../../types/datatype";
import OpcClient from "./opcClient";
import fs from 'fs';
import { CONFIG_PATH } from "../constantes";
import { PnType } from "../../types/pnType";
import { UnknownNodeError } from "../errors/UnknownNodeError";
import log4js from 'log4js';

export default class OpcManager {

    logger = log4js.getLogger('DataUpdater');
    opcClients: OpcClient[] = []

    public constructor() { }

    public updateData(updateMessages: UpdateDataType) {

        const promises: Promise<string>[] = []
        Object.keys(updateMessages).forEach((key) => {

            let client = this.opcClients.find((opcClient) => opcClient.containNode(key))
            if (client) {
                promises.push(client.sendUpdate({ [key]: updateMessages[key] }))
            } else {
                try {
                    client = this.findServer(key)
                    promises.push(client.sendUpdate({ [key]: updateMessages[key] }))
                }
                catch (err) {
                    promises.push(new Promise((_, rej) => rej(err)))
                }
            }
        })

        return Promise.all(promises);
    }

    public readData(displayName: string): Promise<any> {
        let client = this.opcClients.find((opcClient) => opcClient.containNode(displayName))
        if (client) {
            return client.readValue(displayName)
        } else {
            try {
                client = this.findServer(displayName)
                return client.readValue(displayName)
            }
            catch (err) {
                return new Promise((_, rej) => rej(err))
            }
        }
    }

    findServer(displayName: string): OpcClient {
        let rawdata = fs.readFileSync(CONFIG_PATH);
        let options: PnType[] = JSON.parse(rawdata.toString());
        let server: PnType = undefined

        for (let option of options) {
            for (let node of option.OpcNodes) {
                if (node.DisplayName == displayName) {
                    server = option;
                    break;
                }
            }
            if (server) break;
        }

        if (!server) throw new UnknownNodeError(`Display name ${displayName} not found in any server`)

        const existingClient = this.opcClients.find((client) => client.hostname == server.EndpointUrl)
        if (existingClient) {
            this.logger.info("Update nodes for " + server.EndpointUrl)
            existingClient.updateNodes(server.OpcNodes)
            return existingClient
        } else {
            this.logger.info("Create new OpcClient for " + server.EndpointUrl)
            const newClient = new OpcClient(server)
            this.opcClients.push(newClient)
            return newClient
        }
    }
}
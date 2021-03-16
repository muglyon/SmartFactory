import { CosmosClient, Database } from "@azure/cosmos";
import { RequestList } from '../types/cosmos'
import shouldDoRequest from "../utils/shouldDoRequest";
import splitEnergyAndStatus from "../utils/datas/splitEnergyAndStatus";
import { GetStatusByCETData, GraphData, ProjectList } from "../types/datas";

class CosmosDbingleton {
    private static instance: CosmosDbingleton;
    database: Database
    requestList: RequestList = {}
    private constructor() {
        const client = new CosmosClient(process.env.COSMOS_CNSTR as string)
        this.database = client.database('TelemetrieDb')
    }

    static getInstance() {
        if (!CosmosDbingleton.instance) {
            CosmosDbingleton.instance = new CosmosDbingleton();
        }
        return CosmosDbingleton.instance;
    }

    public getAllCET() {
        return new Promise<ProjectList[]>(async (res, rej) => {
            if (!this.requestList.getAllCET || shouldDoRequest(this.requestList.getAllCET.lastRequest)) {

                const values = await this.database.container('EolienCET').items.query({
                    query: 'SELECT distinct c.CETEssai FROM c'
                }).fetchAll()

                const itemsWithTime = await Promise.all(
                    values.resources.map(async (x: ProjectList) => {
                        const time = await this.getCETTime(x.CETEssai)
                        return {
                            ...x,
                            time
                        }
                    })
                )

                this.requestList.getAllCET = {
                    lastValues: itemsWithTime,
                    lastRequest: new Date()
                }
            }
            res(this.requestList.getAllCET.lastValues)
        })

    }

    private async getCETTime(CETEssai: string): Promise<string> {


        const values = await this.database.container('Eolien').items.query({
            query: 'SELECT max(c.time) as time FROM c where c.CETEssai = @CETEssai',
            parameters: [
                { name: "@CETEssai", value: CETEssai },
            ]
        }).fetchAll()

        return values.resources[0].time

    }

    public getStatusByCET(CETEssai: string, time: string) {
        return new Promise<GetStatusByCETData>(async (res, rej) => {
            if (!this.requestList.getStatusByCET ||
                this.requestList.getStatusByCET.lastCET !== CETEssai ||
                shouldDoRequest(this.requestList.getStatusByCET.lastRequest)) {
                const query = {
                    query: 'SELECT c.name, c.mode, c.status, c.ObjName, c.input_energy, c.output_energy FROM c where c.CETEssai = @CETEssai and c.time = @time',
                    parameters: [
                        { name: "@CETEssai", value: CETEssai },
                        { name: "@time", value: time }
                    ]
                }
                const values = await this.database.container('Eolien').items.query(query).fetchAll()

                this.requestList.getStatusByCET = {
                    lastValues: splitEnergyAndStatus(values.resources),
                    lastRequest: new Date(),
                    lastCET: CETEssai
                }
            }
            res(this.requestList.getStatusByCET.lastValues)
        })

    }

    public getGraphByIndicator(CETEssai: string, indicator: string) {
        return new Promise<GraphData>(async (res, rej) => {
            if (!this.requestList.getGraphByIndicator ||
                this.requestList.getGraphByIndicator.lastCET !== `${CETEssai} - ${indicator}` ||
                shouldDoRequest(this.requestList.getGraphByIndicator.lastRequest)) {

                const query = {
                    query: 'SELECT * FROM c where c.CETEssai = @CETEssai and c.name = @name',
                    parameters: [
                        { name: "@CETEssai", value: CETEssai },
                        { name: "@name", value: indicator }
                    ]
                }
                const values = await this.database.container('Eolien').items.query(query).fetchAll()
                this.requestList.getGraphByIndicator = {
                    lastValues: values.resources,
                    lastRequest: new Date(),
                    lastCET: `${CETEssai} - ${indicator}`
                }
            }
            res(this.requestList.getGraphByIndicator.lastValues)
        })

    }


}

export default CosmosDbingleton

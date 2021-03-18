import { CosmosClient, Database } from "@azure/cosmos";
import { GraphRequest } from '../types/cosmos'

class CosmosDbingleton {
    private static instance: CosmosDbingleton;
    database: Database
    private constructor() {
        const client = new CosmosClient(process.env.COSMOS_CNSTR as string)
        this.database = client.database('Building')
    }

    static getInstance() {
        if (!CosmosDbingleton.instance) {
            CosmosDbingleton.instance = new CosmosDbingleton();
        }
        return CosmosDbingleton.instance;
    }

    
    public async getGraphData(twinId: string, itemKey: string): Promise<GraphRequest[]> {

        const dt = new Date()
        const lastFiveHour = new Date(dt.setHours(dt.getHours()-5))
        const values = await this.database.container('RoomDatas').items.query({
            query: `SELECT c.date, c.${itemKey} FROM c where c.twinId = @twinId and c.date >= '${lastFiveHour.toISOString()}'`,
            parameters: [
                { name: "@twinId", value: twinId },
            ]
        }).fetchAll()

        return values.resources

    }

    // public getStatusByCET(CETEssai: string, time: string) {
    //     return new Promise<GetStatusByCETData>(async (res, rej) => {
    //         if (!this.requestList.getStatusByCET ||
    //             this.requestList.getStatusByCET.lastCET !== CETEssai ||
    //             shouldDoRequest(this.requestList.getStatusByCET.lastRequest)) {
    //             const query = {
    //                 query: 'SELECT c.name, c.mode, c.status, c.ObjName, c.input_energy, c.output_energy FROM c where c.CETEssai = @CETEssai and c.time = @time',
    //                 parameters: [
    //                     { name: "@CETEssai", value: CETEssai },
    //                     { name: "@time", value: time }
    //                 ]
    //             }
    //             const values = await this.database.container('Eolien').items.query(query).fetchAll()

    //             this.requestList.getStatusByCET = {
    //                 lastValues: splitEnergyAndStatus(values.resources),
    //                 lastRequest: new Date(),
    //                 lastCET: CETEssai
    //             }
    //         }
    //         res(this.requestList.getStatusByCET.lastValues)
    //     })

    // }

    // public getGraphByIndicator(CETEssai: string, indicator: string) {
    //     return new Promise<GraphData>(async (res, rej) => {
    //         if (!this.requestList.getGraphByIndicator ||
    //             this.requestList.getGraphByIndicator.lastCET !== `${CETEssai} - ${indicator}` ||
    //             shouldDoRequest(this.requestList.getGraphByIndicator.lastRequest)) {

    //             const query = {
    //                 query: 'SELECT * FROM c where c.CETEssai = @CETEssai and c.name = @name',
    //                 parameters: [
    //                     { name: "@CETEssai", value: CETEssai },
    //                     { name: "@name", value: indicator }
    //                 ]
    //             }
    //             const values = await this.database.container('Eolien').items.query(query).fetchAll()
    //             this.requestList.getGraphByIndicator = {
    //                 lastValues: values.resources,
    //                 lastRequest: new Date(),
    //                 lastCET: `${CETEssai} - ${indicator}`
    //             }
    //         }
    //         res(this.requestList.getGraphByIndicator.lastValues)
    //     })

    // }


}

export default CosmosDbingleton

import { Request, Response } from 'express';
import cosmosDbSingleton from '../CosmosDbSingleton';

export default function getGraphData(req: Request, res: Response) {

    const twinId = req.query.twinId?.toString()
    const itemKey = req.query.itemKey?.toString()

    if(!twinId) {
        res.status(400)
        res.send('Missing twinId parameter')
    } else if (!itemKey) {
        res.status(400)
        res.send('Missing itemKey parameter')
    } else {
        cosmosDbSingleton.getInstance().getGraphData(twinId, itemKey).then((values) => {
            res.status(200)
            console.log("GO !", values)
            res.send(values)
        })
            .catch((err) => {
                console.error(`Erreur lors de la récupération des données graphiques`, err);
                res.status(500);
                res.send(err);
            });
    }
    
}

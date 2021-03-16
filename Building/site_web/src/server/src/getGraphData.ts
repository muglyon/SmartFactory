import { Request, Response } from 'express';
import cosmosDbSingleton from '../CosmosDbSingleton';

export default function getGraphData(req: Request, res: Response) {

    const CETEssai = req.query.CETEssai?.toString()
    const indicator = req.query.indicator?.toString()

    if(!CETEssai) {
        res.status(400)
        res.send('Missing CETEssai parameter')
    } else if (!indicator) {
        res.status(400)
        res.send('Missing indicator parameter')
    } else {
        cosmosDbSingleton.getInstance().getGraphByIndicator(CETEssai, indicator).then((values) => {
            res.status(200)
            res.send(values)
        })
            .catch((err) => {
                console.error(`Erreur lors de la récupération des données graphiques`, err);
                res.status(500);
                res.send(err);
            });
    }
    
}

import { Request, Response } from 'express';
import cosmosDbSingleton from '../CosmosDbSingleton';

export default function getStatus(req: Request, res: Response) {

    const CETEssai = req.query.CETEssai?.toString()
    const time = req.query.time?.toString()

    if (!CETEssai) {
        res.status(400)
        res.send('Missing CETEssai parameter')
    } else if (!time) {
        res.status(400)
        res.send('Missing time parameter')
    } else {
        cosmosDbSingleton.getInstance().getStatusByCET(CETEssai, time).then((values) => {
            res.status(200)
            res.send(values)
        })
            .catch((err) => {
                console.error(`Erreur lors de la récupération du status`, err);
                res.status(500);
                res.send(err);
            });
    }

}

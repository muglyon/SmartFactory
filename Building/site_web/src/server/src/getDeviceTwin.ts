import { Request, Response } from 'express';
import DeviceTwinSingleton from '../DeviceTwinSingleton';

export default function getDeviceTwin(req: Request, res: Response) {

    const twinId = req.query.twinId?.toString()

    if (!twinId) {
        res.status(400)
        res.send('Missing twinId parameter')
    } else {
        DeviceTwinSingleton.getInstance().getDeviceTwin(twinId).then((values) => {
            res.status(200)
            console.log("GO !", values)
            res.send(values)
        })
            .catch((err) => {
                console.error(`Erreur lors de la récupération du twin`, err);
                res.status(500);
                res.send(err);
            });
    }

}

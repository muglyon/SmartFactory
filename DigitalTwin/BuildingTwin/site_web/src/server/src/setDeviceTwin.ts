import { Request, Response } from 'express';
import DeviceTwinSingleton from '../DeviceTwinSingleton';

export default function setDeviceTwin(req: Request, res: Response) {

    const body = req.body
    const twinId = body.twinId?.toString()
    const props = body.props


    if (!twinId) {
        res.status(400)
        res.send('Missing twinId parameter')
    } else if (!props) {
        res.status(400)
        res.send('Missing props parameters')
    } else {
        DeviceTwinSingleton.getInstance().setDesiredProperties(twinId, props).then((values) => {
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

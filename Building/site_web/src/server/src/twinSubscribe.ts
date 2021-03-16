import { Request, Response } from 'express';
import DigitalTwinSingleton from '../DigitalTwinSingleton';

export default function twinSubscribe(req: Request, res: Response) {

    const twinId = req.query.twinId?.toString()

    if (!twinId) {
        res.status(400)
        res.send('Missing twinId parameter')
    } else {
        DigitalTwinSingleton.getInstance().addTwinId(twinId)
        res.status(200)
        res.send("OK")
     
    }

}

import { Registry, Twin } from "azure-iothub";

export default class DeviceTwinSingleton {

    private static instance: DeviceTwinSingleton;

    private service: Registry;
    private twins: { [key: string]: Twin } = {}

    private constructor() {

        this.service = Registry.fromConnectionString(process.env.IOTHUB_CNSTR as string)
    }

    static getInstance() {
        if (!DeviceTwinSingleton.instance) {
            DeviceTwinSingleton.instance = new DeviceTwinSingleton();
        }
        return DeviceTwinSingleton.instance;
    }

    getDeviceTwin(twinId: string) {
        return new Promise<any>((res, rej) => {
            this.service.getTwin(twinId, (err, twin) => {
                if (err) {
                    rej(err.constructor.name + ': ' + err.message);
                } else if (!twin) {
                    rej("Twin not found")
                } else {
                    const reported = {...twin.properties.reported}
                    delete reported["$metadata"]
                    delete reported["$version"]
                    this.twins[twinId] = twin
                    res(reported)
                }
            })
        })
    }

    setDesiredProperties(twinId: string, props: any) {
        return new Promise<any>((res, rej) => {
            const patch = {
                properties: {
                    desired: {
                        ...props
                    }
                }
            }
            const twin = this.twins[twinId]

            if (!twin) {
                rej("Twin not found")
            } else {
                
                twin.update(patch, function (err) {
                    if (err) {
                        rej('Could not update twin: ' + err.constructor.name + ': ' + err.message);
                    } else {
                        res(twin.deviceId + ' twin updated successfully');
                    }
                });
            }

        })

    }
}
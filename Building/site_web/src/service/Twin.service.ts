import constantes from '../utils/constantes';
import defaultXHRRequest from '../utils/defaultXHRRequest';
import formatParams from '../utils/formatParams';

export default class TwinService {
    public static async requestTwinSubscription(twinId: string) {
        return new Promise<void>(async (resolve, reject) => {
            const xhr = defaultXHRRequest(resolve, reject)

            xhr.open("GET", `${document.location.protocol}//${document.location.host}${constantes.URLS.TWIN_SUBSCRIBE}${formatParams({
                twinId
            })}`, true);

            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send();
        });
    }

    public static async getDeviceTwin(twinId) {
        return new Promise<any>(async (resolve, reject) => {
            const xhr = defaultXHRRequest(resolve, reject)

            xhr.open("GET", `${document.location.protocol}//${document.location.host}${constantes.URLS.DEVICE_TWIN}${formatParams({
                twinId
            })}`, true);

            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send();
        });
    }

    public static async setDeviceTwin(twinId: any, props: any) {
        return new Promise<void>(async (resolve, reject) => {
            console.log("PROUT", JSON.stringify({
                twinId,
                props
            }))
            fetch(
                `${document.location.protocol}//${document.location.host}${constantes.URLS.DEVICE_TWIN}`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        twinId,
                        props
                    }),
                    headers: { "Content-Type": "application/json" }

                }
            ).then(
                response => resolve()
            ).catch((err) => {
                reject(err)
            })

        });
    }
}
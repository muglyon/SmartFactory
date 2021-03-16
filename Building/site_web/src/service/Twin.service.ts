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
}
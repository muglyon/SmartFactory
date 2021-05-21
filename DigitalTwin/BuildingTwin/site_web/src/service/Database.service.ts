import { GraphRequest } from '../types/cosmos';
import constantes from '../utils/constantes';
import defaultXHRRequest from '../utils/defaultXHRRequest';
import formatParams from '../utils/formatParams';

export default class DatabaseService {
    public static async queryGraphData(twinId: string, itemKey: string) {
        return new Promise<GraphRequest[]>(async (resolve, reject) => {
            const xhr = defaultXHRRequest(resolve, reject)
            xhr.open("GET",
                `${document.location.protocol}//${document.location.host}${constantes.URLS.GET_GRAPH_URL}${formatParams({
                    twinId,
                    itemKey
                })}`,
                true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send();
        });
    }
}
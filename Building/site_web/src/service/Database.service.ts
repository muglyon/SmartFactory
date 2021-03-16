import { GetStatusByCETData, GraphData, ProjectList } from '../types/datas';
import constantes from '../utils/constantes';
import defaultXHRRequest from '../utils/defaultXHRRequest';
import formatParams from '../utils/formatParams';

export default class DatabaseService {
    public static async queryCET() {
        return new Promise<ProjectList[]>(async (resolve, reject) => {
            const xhr = defaultXHRRequest(resolve, reject)

            xhr.open("GET", `${document.location.protocol}//${document.location.host}${constantes.URLS.GET_CET_URL}`, true);

            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send();
        });
    }

    public static async queryStatusByCET(CETEssai: string, time?: string) {
        return new Promise<GetStatusByCETData>(async (resolve, reject) => {
            const xhr = defaultXHRRequest(resolve, reject)
            xhr.open("GET",
                `${document.location.protocol}//${document.location.host}${constantes.URLS.GET_STATUS_URL}${formatParams({
                    CETEssai,
                    time
                })}`,
                true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send();
        });
    }

    public static async queryGraphData(CETEssai: string, indicator: string) {
        return new Promise<GraphData>(async (resolve, reject) => {
            const xhr = defaultXHRRequest(resolve, reject)
            xhr.open("GET",
                `${document.location.protocol}//${document.location.host}${constantes.URLS.GET_GRAPH_URL}${formatParams({
                    CETEssai,
                    indicator
                })}`,
                true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send();
        });
    }
}
import constantes from "./constantes";

export default function defaultXHRRequest<T>(resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = async function () {

        if (this.readyState != constantes.REQUEST_COMPLETE_STATE) return;

        if (this.status == constantes.HTTP_CODES.OK) {
            const data = JSON.parse(this.responseText);
            resolve(data);
        } else {
            reject(this.responseText);
        }

    };

    return xhr
}
import KeyVaultSingleton from '../server/KeyVaultSingleton';
import constantes from './constantes';

export default function getUrl() {
    let url = process.env.WEBSITE_HOSTNAME
        // ? `https://${process.env.WEBSITE_HOSTNAME}`
        ? KeyVaultSingleton.secretList['appUrl']
        : constantes.URLS.DEV_URL;
    
    if (typeof window !== 'undefined') {
        
        url = `${window.location.protocol}//${window.location.host}`;
    }

    return url;
}
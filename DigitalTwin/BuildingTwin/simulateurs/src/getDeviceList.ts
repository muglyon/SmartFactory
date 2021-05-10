export default function getDeviceList() {
    try {
        const devices = JSON.parse(process.env.DEVICES_CONNECTION_STRING)
        if (!Array.isArray(devices)) {
            throw new Error("La variable d'environnement DEVICES_CONNECTION_STRING doit être un tableau de connection string")
        } else {
            return devices
        }
    } catch (err) {
        console.error(err)
        return null
    }
}
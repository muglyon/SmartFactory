export default function getDevice() {
    try {
        const device = process.env.DEVICE_CONNECTION_STRING
        if (!device) {
            throw new Error("La variable d'environnement DEVICE_CONNECTION_STRING est manquante")
        } else {
            return device
        }
    } catch (err) {
        console.error(err)
        return null
    }
}
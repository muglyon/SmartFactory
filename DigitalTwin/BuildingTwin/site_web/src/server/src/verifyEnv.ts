export default function verifyEnv() {
    if (process.env.CLIENT_ID &&
        process.env.TENANT_ID &&
        process.env.CLIENT_SECRET &&
        process.env.COSMOS_CNSTR &&
        process.env.TWIN_ENDPOINT &&
        process.env.SIGNALR_ENDPOINT &&
        process.env.IOTHUB_CNSTR) {
        return true;
    }
    throw new Error("Missing env TENANT_ID or CLIENT_ID or CLIENT_SECRET");
}
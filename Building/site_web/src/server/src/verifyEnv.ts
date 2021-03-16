export default function verifyEnv() {
    if (process.env.CLIENT_ID &&
        process.env.TENANT_ID &&
        process.env.CLIENT_SECRET &&
        process.env.COSMOS_CNSTR &&
        process.env.TWIN_ENDPOINT) {
        return true;
    }
    throw new Error("Missing env TENANT_ID or CLIENT_ID or CLIENT_SECRET");
}
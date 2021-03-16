export default {
    URLS : {
        DEV_URL : "http://localhost:3000",
        ADMIN_BASE_URL: "admin",
        TWIN_SUBSCRIBE: '/twin/subscribe',
        GET_GRAPH_URL: '/data/graph'
    },
    WEBISTE_TITLE: "Cetim Smart Data",
    REQUEST_COMPLETE_STATE: 4,
    HTTP_CODES: {
        OK: 200,
        SERVER_ERROR: 502
    },
    CHART_DEFAULT : {
        STROKE_COLOR: "#000",
        STROKE_DASHARRAY: "3 3"
    },
    CONFIG: {
        KEYVAULT_NAME: process.env.KEYVAULT_NAME as string,
        TENANT_ID: process.env.TENANT_ID as string,
        CLIENT_ID: process.env.CLIENT_ID as string,
        CLIENT_SECRET: process.env.CLIENT_SECRET as string
    }
}
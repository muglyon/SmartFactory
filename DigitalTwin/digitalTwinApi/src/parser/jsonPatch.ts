export default function jsonPatcher(json: { [key: string]: any }) {
    return Object.keys(json).map((key) => {
        return {
            "op": "add",
            "path": "/" + key,
            "value": json[key]
        }
    })
}
export default function isEmptyArray(data: any[]): data is [] {
    return data.length == 0
}
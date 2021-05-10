export default function csvDataParser(item: {[key: string]: any}) {
    const result = {}
    Object.keys(item).forEach((path) => {
        
        const keys = path.split('.')
        const last = keys.pop();
        keys.reduce((previous, current) => { return previous[current] = previous[current] || {}; }, result)[last] = item[path];

    })

    return result
}
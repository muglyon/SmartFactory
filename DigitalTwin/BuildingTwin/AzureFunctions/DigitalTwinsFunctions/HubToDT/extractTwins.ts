
// Cette fonction recherche tous les objets ayant la propriété "TwinId" et les utilise
// pour créer des objets distincts. Toutes les propriétés restantes sont considérées comme
// appartenant au digital twin du device.
export default function extractTwins(deviceId: string, message: any): any {
    const flattened = flattenObject(message)

    const toReturn: any = {}

    const twinList = Object.keys(flattened)
        .filter((x) => x.includes('TwinId'))
        .map((x) => x.replace('.TwinId', ''))
        .sort((a, b) => b.length - a.length);

    const otherKeys = Object.keys(flattened).filter((x) => !x.includes('TwinId'))

    otherKeys.forEach((key) => {

        // const parentKey = twinList.find((x) => key.split('.').includes(x))
        const splittedKey = key.split('.')
        let parentKey: string;
        while(splittedKey.length > 0 && !parentKey) {
            splittedKey.pop()
            parentKey = twinList.find((x) => splittedKey.join('.') == x)
        }
        // const parentKey = twinList.find((x) => key.includes(x))
        const reducedKey = parentKey ? key.replace(parentKey + '.', '') : key
        const deviceKey = parentKey ? flattened[parentKey + '.TwinId'] : deviceId
        if (!toReturn[deviceKey]) {
            toReturn[deviceKey] = {}
        }
        toReturn[deviceKey][reducedKey] = flattened[key]
    })

    return unflattenObject(toReturn)

}

function flattenObject(ob: object) {
    const toReturn = {};

    for (const i in ob) {
        if (!ob.hasOwnProperty(i)) continue;

        if (typeof ob[i] == 'object' && !(ob[i] instanceof Date) && ob[i] !== null) {
            const flatObject = flattenObject(ob[i]);
            for (const x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;

                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
};

function unflattenObject(ob: object) {
    const result = {}

    Object.keys(ob).forEach((device) => {
        result[device] = {}

        for (const i in ob[device]) {
            const keys = i.split('.')
            keys.reduce((previous, current, index) => {
                return previous[current] ||
                    (previous[current] = isNaN(Number(keys[index + 1]))
                        ? (keys.length - 1 == index 
                            ? ob[device][i]
                            : {})
                        : [])
            }, result[device])
        }
        return result
    })

    return result
}
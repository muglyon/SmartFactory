import csvParser from 'csv-parser';
import * as fs from 'fs'

// Function to get the filenames present
// in the directory
export function csvLoaderFolder<T=any>(dirname: string) {
    return new Promise<T[]>((resolve, reject) => {
        fs.readdir(dirname, (error, filenames) => {
            if (error) {
                reject(error);
            } else {
                const files = filenames.filter((filename) => {
                    return filename.split('.')[1] == 'csv';
                });

                Promise.all(files.map((filename) => csvLoader(dirname + '/' + filename))).catch((err) => {
                    reject(err)
                }).then((result) => {
                    const results = []
                    if (result) {
                        result.forEach((x) => results.push(...x))
                    }
                    resolve(results)
                })

            }
        });
    });
}

export function csvLoader<T=any>(path: string) {
    return new Promise<T[]>((res, rej) => {

        const results = []

        fs.createReadStream(path, 'utf-8')
            .pipe(csvParser({ separator: ';', mapValues: dataTyping }))
            .on('data', (data) => results.push(data))
            .on('end', () => {
                res(results)
            })
            .on('error', (err) => rej(err))
    })

}

function dataTyping({ value }) {
    if (value === '') return undefined
    if(isNaN(value)) {
        return value
    } else return parseFloat(value)
} 
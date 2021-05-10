import * as fs from 'fs'
import { Model, ModelList } from '../types/modelType'
import { join } from 'path'
// Function to get the filenames present
// in the directory
export function jsonLoaderFolder(dirname: string) {
    return new Promise<ModelList>((resolve, reject) => {
        fs.readdir(dirname, (error, filenames) => {
            if (error) {
                reject(error);
            } else {
                const models = {}
                filenames.filter((filename) => {
                    return filename.split('.')[1] == 'json';
                }).forEach((filename) => {
                    try {
                        const json = jsonLoader(join(dirname, filename))
                        if (json['@id']) {
                            models[json['@id']] = json
                        }
                    } catch (err) {

                        reject(err)
                    }
                })
                resolve(models)
            }
        });
    });
};

export function jsonLoader(path: string) {
    const content = fs.readFileSync(path, 'utf-8')
    const json: Model = JSON.parse(content)

    return json
}
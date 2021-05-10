import csv from 'csvtojson';

let datas: any[] = []
let i = 0;

const HuileSimulator = async () => {

    if (datas.length == 0) {
        try {

            datas = await csv({
                delimiter: ";",
                checkType: true
            }).fromFile(__dirname + '/datas.csv')
        } catch (error) {
            console.error(error)
        }
    }

    if (i >= datas.length) i = 0;
    datas[i].timestamp = new Date()
    // console.log("send datas -->", datas[i])
    
    return datas[i++]
};


export default HuileSimulator;
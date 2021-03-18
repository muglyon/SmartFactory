import { Client, Message, Twin } from 'azure-iot-device'
import { clientFromConnectionString } from 'azure-iot-device-mqtt'
import flatten from 'flat';
import { Datas, TwinProperties } from 'messageType';

const COEFF_CLIM_ENERGY = 35
const COEFF_LUMENS_ENERGY = 65
export default class Device {

    deviceBaseName: string;
    deviceNumber: string
    client: Client;
    datas: Datas = {
        temp: 10,
        nbPeople: 0,
        luminosity: 0,
        lightConsumption: 0,
        escalatorConsumption: 0,
        climConsumption: 0,
        date: new Date().toISOString()
    }

    twinData: TwinProperties;

    public constructor(connectionString: string) {

        this.client = clientFromConnectionString(connectionString)

        const deviceName = this.extractDeviceBaseName(connectionString)
        const split = deviceName.split('_')
        this.deviceBaseName = split[0]
        this.deviceNumber = split[1]

        this.client.open((err) => {
            if (err) {
                console.error('Could not connect: ' + err);
            } else {
                console.log('Client connected');
            };

            this.client.getTwin((err, twin) => {
                if (err) {
                    console.error('could not get twin');
                } else {
                    this.twinData = twin.properties.desired as TwinProperties
                    delete this.twinData["$version"]
                    this.updateReportedTwin(twin);
                }

                twin.on('properties.desired', (delta) => {
                    this.twinData = {
                        ...this.twinData,
                        ...delta
                    }
                    delete this.twinData["$version"]
                    this.updateReportedTwin(twin);
                })
            });
        })

    }

    extractDeviceBaseName(connectionString: string) {
        const parts = connectionString.split(";")
        const deviceId = parts[1].split('=')[1]
        return deviceId;
    }

    updateReportedTwin(twin: Twin) {

        console.log("Setting target twin to " + JSON.stringify(this.twinData))
        twin.properties.reported.update(
            this.twinData, function (err) {
                if (err) {
                    console.error(err)
                    console.error('could not update twin');
                } else {
                    console.log('twin state reported');
                }
            })
    }

    process() {
        this.updateTemp()
        this.updateNbPers();
        this.updateLum();
        this.updateConso();
    }

    updateTemp() {
        if (this.datas.temp > this.twinData.targetTemp) {
            this.datas.temp -= Math.random()/5
        } else {
            this.datas.temp += Math.random()/5
        }
    }

    updateNbPers() {
        if (Math.random() < 0.5) {
            this.datas.nbPeople += parseInt((Math.random() * 10).toFixed())
        } else {
            this.datas.nbPeople = Math.max(0, this.datas.nbPeople - parseInt((Math.random() * 10).toFixed()))
        }
    }

    updateLum() {
        const surface = this.twinData.length * this.twinData.height
        if (this.datas.nbPeople > 0 && this.twinData.isLightRun) {
            this.datas.luminosity = 300 * surface
        } else {
            this.datas.luminosity = 100 * surface
        }
    }

    updateConso() {
        const volume = this.twinData.length * this.twinData.height * this.twinData.width
        const deviceNumber = parseInt(this.deviceNumber)
        this.datas.escalatorConsumption = this.twinData.isEscalatorRun ?
            (2000 + (Math.random() * 1000)) * deviceNumber
            : 0

        console.log(this.twinData.isEscalatorRun, this.datas.escalatorConsumption)
        // 35W par m3
        this.datas.climConsumption = volume * COEFF_CLIM_ENERGY

        // 1000 lumens = 65 W
        // actual Luments = ?
        this.datas.lightConsumption = (this.datas.luminosity * COEFF_LUMENS_ENERGY) / 1000
    }

    sendUpdate() {
        this.client.sendEvent(new Message(JSON.stringify(flatten(this.formatToDT()))), (err, result) => {
            if (err) {
                console.error(err)
            } else {
                console.log("message sent")
            }
        })
    }

    formatToDT() {
        const volume = this.twinData.length * this.twinData.height * this.twinData.width
        const globalConsumption = this.datas.lightConsumption + this.datas.escalatorConsumption + this.datas.climConsumption
        const date = new Date().toISOString()

        return {
            temp: {
                TwinId: "Clim_" + this.deviceNumber,
                date,
                version: this.twinData.climVersion,
                consumption: this.datas.climConsumption,
                temperature: this.datas.temp,
                desiredTemperature: this.twinData.targetTemp
            },
            escalator: {
                TwinId: "Escalator_" + this.deviceNumber,
                date,
                isRunning: this.twinData.isEscalatorRun,
                consumption: this.datas.escalatorConsumption
            },
            light: {
                TwinId: "Light_" + this.deviceNumber,
                date,
                isRunning: this.twinData.isLightRun,
                consumption: this.datas.lightConsumption,
                luminosity: this.datas.luminosity
            },
            date,
            width: this.twinData.width,
            height: this.twinData.height,
            length: this.twinData.length,
            eco: volume * globalConsumption / 1000,
            globalConsumption,
            nbPeople: this.datas.nbPeople
        }
    }

}
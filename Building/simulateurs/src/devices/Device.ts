import { Client, Message, Twin } from 'azure-iot-device'
import { clientFromConnectionString } from 'azure-iot-device-mqtt'
import flatten from 'flat';
import { Datas, TwinProperties } from 'messageType';

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
            this.datas.temp -= Math.random()
        } else {
            this.datas.temp += Math.random()
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
        const volume = this.twinData.length * this.twinData.height * this.twinData.width
        if (this.datas.nbPeople > 0 && this.twinData.isLightRun) {
            this.datas.luminosity = 1000 * volume
        } else {
            this.datas.luminosity = 100 * volume
        }
    }

    updateConso() {
        const volume = this.twinData.length * this.twinData.height * this.twinData.width
        this.datas.escalatorConsumption = this.twinData.isEscalatorRun ? 10000 + (Math.random() * 1000) : 0
        this.datas.climConsumption = volume * 35

        // 1000 lumens = 65 W
        // actual Luments = ?
        this.datas.lightConsumption = (this.datas.luminosity * 65) / 1000
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
        const globalConsumption= this.datas.lightConsumption + this.datas.escalatorConsumption + this.datas.climConsumption
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
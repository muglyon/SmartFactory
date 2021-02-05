import { Datas, Position } from 'messageType';
import { Client, Message } from 'azure-iot-device'
import { clientFromConnectionString } from 'azure-iot-device-amqp'

export default class Device {

    client: Client

    protected datas: Datas;


    constructor(connectionString: string) {
        this.datas = {
            isGripperOpen: true,
            isRunning: true,
            workOrder: "0",
            position: {
                x: 0.5,
                y: 0.5,
                z: 0.5
            }
        };

        this.client = clientFromConnectionString(connectionString)

        this.client.open((err) => {
            if (err) {
                console.error('Could not connect: ' + err);
            } else {
                console.log('Client connected');
                this.sendUpdate()
                this.setDeviceMethod()
            };
        })
    }

    setDeviceMethod() {
        this.client.onDeviceMethod('closeGripper', (req, res) => {

            this.setGripperStatus(false)
            this.sendUpdate()

            res.send(200, "Gripper updated")
        })

        this.client.onDeviceMethod('openGripper', (req, res) => {

            this.setGripperStatus(true)
            this.sendUpdate()

            res.send(200, "Gripper updated")
        })

        this.client.onDeviceMethod('turnOn', (req, res) => {

            this.setRunningStatus(true)
            this.sendUpdate()

            res.send(200, "Running status updated")
        })

        this.client.onDeviceMethod('turnOff', (req, res) => {

            this.setRunningStatus(false)
            this.sendUpdate()

            res.send(200, "Running status updated")
        })

        this.client.onDeviceMethod('setWorkOrder', (req, res) => {
            const name = req.payload

            this.setWorkOrder(name)
            this.sendUpdate()

            res.send(200, "Work order updated")
        })

        this.client.onDeviceMethod('setPosition', (req, res) => {
            const position = req.payload.position

            this.setPosition(position)
            this.sendUpdate()

            res.send(200, "Position updated")
        })
    }

    setGripperStatus(status: boolean) {
        this.datas.isGripperOpen = status
    }

    setRunningStatus(status: boolean) {
        this.datas.isRunning = status
    }
    
    setWorkOrder(name: string) {
        this.datas.workOrder = name
    }

    setPosition(position: Partial<Position>) {
        for(const key of Object.keys(position)) {
            console.log(key)
            this.datas.position[key] = position[key]
        }
    }

    // Should be override.
    sendUpdate() { 
        this.client.sendEvent(new Message(JSON.stringify(this.datas)), (err, result) => {
            if (err) {
                console.error(err)
            } else {
                console.log("message sent")
            }
        })
    }


}
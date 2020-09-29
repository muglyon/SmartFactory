#############################################

# Copyright 2020 CC-BY-SA author : MUG Lyon

#############################################

## SmartFactory - Simulation OPC-UA Server / Client

With this tool you can emulate a OPC-UA server and somes datas with nodejs.
This project is powered by  [node-opcua](https://github.com/node-opcua/node-opcua "node-opcua").

### Getting Started
```
npm install
npm start
```

The project is started, you should see informations in console. Like this.

```
Server is now listening ... (press CTRL+C to stop)
 the primary server endpoint url is  opc.tcp://INV011498:4334/UA/SmartFactory
Value changed by client !  1.1
Value changed by client !  0.608564388534536
Value changed by client !  1.356691161066117
Value changed by client !  5.18082014708217
Value changed by client !  6.203266104182854
Value changed by client !  8.683348743074347
Value changed by client !  3.9461922592302634
Value changed by client !  8.560708960781353
Value changed by client !  4.1213872390956325
Value changed by client !  2.6062222077107045
Value changed by client !  9.27313758010749
Value changed by client !  4.85616050355457
Value changed by client !  8.23009544175288
```

The first line is your OPC-UA server endpoint. You can use a custom OPC-UA client for take a look to your OPC nodes.
I recommend you [UAExpert](https://www.unified-automation.com/products/development-tools/uaexpert.html "UAExpert")

### Go deeply
You can modify the simulation in `app.ts` file.
We let you enjoy to connect it to a Azure IoT Hub by example !
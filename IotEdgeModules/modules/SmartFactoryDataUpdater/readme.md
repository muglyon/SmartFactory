#############################################

# Copyright 2020 CC-BY-SA author : MUG Lyon

#############################################

# SmartFactory IoT Edge Modules : Data Updater

## Direct Methods

### DataUpdate

#### Body 

```json
{
    "<opc-ua node Display Name>" : "Value"
}
```

Exemple working with Production_simulator
```json
{
    "clientDevice.constantVar": 4812
}
```
Hint :
You can see all opc-ua node display name in your [OPC Publisher pn.json](https://docs.microsoft.com/en-us/azure/iot-accelerators/howto-opc-publisher-configure "OPC Publisher pn.json")

#### Response

```json
{
    "status": 200,
    "payload": "Good"
}
```
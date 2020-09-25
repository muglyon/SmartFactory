import OpcServer from './OPC/opcServer';
import OpcClient from './OPC/opcClient';
import config from './config.json';
import { DataValue } from 'node-opcua';

const main = async () => {
  const opcServer = new OpcServer()
  const opcClient = new OpcClient()

  const datas = {
    hour: new Date(),
    DEB_OF_LF1: 1,
    FIN_OF_LF1: 0,
    NB_BOUT_LF1: 5,
    NB_CARTON_LF1: 0,
    VOY_AUTRES_LF1: 0,
    BP_QUAL_LF1: 0,
    BP_ORGA_LF1: 0,
    BP_CHTFORMAT_LF1: 0,
    BP_PANNES_LF1: 0,
    BP_AP_LF1: 0,
    CADENCE_LF1: 5000,
    TRS_OBJECTIF: 75,
    OF_LF1: 20020015,
    ARTICLE_LF1: 'Créaline H2O',
    LOT_LF1: 20015,
    RANDOM_VALUE: 0
  }

  datas.hour.setHours(8, 0, 0, 0)

  await opcServer.sessionInit(datas)
  await opcClient.connectClient();

  let stopIncrease: boolean = false

  await opcClient.getNodeMonitor(config.interrupteurNodeId).then((monitor) => {
    monitor.on("changed", (value: DataValue) => {
      if (value.value.value !== null) {

        if (value.value.value === 0) {
          stopIncrease = false
        } else {
          stopIncrease = true
        }
      }
      console.log("Interrupteur value ==> ", value.value.value)
    })
  }).catch((err) => {
    console.error(err)
  })

  const intervalFunction = () => {
    datas.hour = new Date(datas.hour.getTime() + 15 * 60000) // Add 15 minutes

    if (datas.hour.getHours() == 0 && datas.hour.getMinutes() == 0) {

      datas.hour.setHours(8, 0, 0, 0)
      datas[config.counter] = 0;
      datas["OF_LF1"] += 1
      datas["DEB_OF_LF1"] = 1

    } else {
      
      datas["DEB_OF_LF1"] = 0
      if (stopIncrease == false) {
        datas[config.counter] += Math.floor(Math.random() * 200) + 100; // Random between 1 and 300
      }
    
    }
    datas.RANDOM_VALUE++;


    console.log("CARTON ==> ", datas[config.counter])
    opcServer.sendUpdate(datas)
  }

  setInterval(intervalFunction, 2000)

}

main()
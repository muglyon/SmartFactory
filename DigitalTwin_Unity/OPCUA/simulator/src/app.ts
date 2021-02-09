import OpcServer from './OPC/OpcServer';

const main = async () => {
  const opcServer = new OpcServer()

  const datas = {
    isGripperOpen: true,
    isRunning: true,
    workOrder: "0",
    position_x: 0.5,
    position_y: 0.5,
    position_z: 0.5,
  }

  await opcServer.sessionInit(datas);

}

main()
import OpcServer from './OPC/opcServer';
import OpcClient from './OPC/opcClient';
import { Variant, DataType, StatusCodes } from 'node-opcua';

async function main() {
  // *** SERVER PART ***
  const server = new OpcServer();

  await server.sessionInit();
  let randomValueOfDevice1 = 1.0;
  const newDevice = server.namespace.addObject({
    organizedBy: server.server.engine.addressSpace.rootFolder.objects,
    browseName: "Device1"
  });

  server.namespace.addVariable({
    componentOf: newDevice,
    browseName: "random",
    dataType: "Double",
    value: {
      get: function () {
        return new Variant({ dataType: DataType.Double, value: randomValueOfDevice1 });
      }
    }
  });

  setInterval(() => {
    // Value is changed by server
    randomValueOfDevice1 = Math.random() * 10;
  }, 500);

  // *** CLIENT PART ***

  const clientDevice = server.namespace.addObject({
    organizedBy: server.server.engine.addressSpace.rootFolder.objects,
    browseName: "clientDevice"
  });

  let clientVarValue = 1.1;

  // We'll modify this variable with our local opc client.
  const clientVar = server.namespace.addVariable({
    componentOf: clientDevice,
    browseName: "clientVar",
    dataType: "Double",
    value: {
      get: function () {
        return new Variant({ dataType: DataType.Double, value: clientVarValue });
      },
      set: function (variant: Variant) {
        clientVarValue = variant.value;
        return StatusCodes.Good;
      }
    }
  });

  // Create a constante var for test modification with another client.
  server.namespace.addVariable({
    componentOf: clientDevice,
    browseName: "constantVar",
    dataType: "Double",
    value: {
      get: function () {
        return new Variant({ dataType: DataType.Double, value: 10.0 });
      },
      set: function () {
        return StatusCodes.Good;
      }
    }
  });

  const client = new OpcClient();
  await client.connectClient(server.hostname);

  const nodeMonitor = await client.getNodeMonitor(clientVar.nodeId.displayText());
  nodeMonitor.on("changed", (dataval) => {
    console.log("Value changed by client ! ", dataval.value.value);
  });


  setInterval(async () => {
    // Value is changed by the client
    await client.modifyNode(clientVar.nodeId.toString(), Math.random() * 10)

  }, 1000)

}

main()
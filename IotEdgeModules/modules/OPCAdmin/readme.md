# SmartFacotry - OPCAdmin

## Getting Started : 
This module allow you to get a opc server active on the IoT Edge network and get his nodes.

## Direct methods :

### getNodes
#### Request
```json
{
  "url": "opc.tcp://YourOPC-UA_Server_Adress",
  "nodeId": "(optionnal) The parent nodeId. By default it take the root node Id"
}
```

Example (work with Production_simulator) :
```json
{
  "url": "opc.tcp://127.0.0.1:4334/UA/SmartFactory",
  "nodeId": "ns=1;i=1002"
}
```


#### Response
```json
{ 
  "status": HttpErrorCode,
  "payload": { 
     "NodeId": { "id": "ns=NameSpaceNumber;i=NodeId", "isSubscribed": false }
  }
}
```

Example (work with Production_simulator) :
```json
{ 
  "status": 200,
  "payload": { 
     "1003": { "id": "ns=1;i=1003", "isSubscribed": false },  
     "1004": { "id": "ns=1;i=1004", "isSubscribed": false } 
  }
}
```

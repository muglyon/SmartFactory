
import * as opcua from 'node-opcua';
import OpcClient from '../../src/utils/OpcClient';
import { OpcNode } from '../../types/pnType';
import { ROOT_OPC_FOLDER } from '../../src/constantes'
import { ClientSession, BrowseResult, ReferenceDescription } from 'node-opcua';

describe('opcClient tests', () => {
    let shouldReject = false
    let session: any;



    beforeEach(() => {

        shouldReject = false
        session = {
            writeSingleNode: jest.fn((nodeToWrite: opcua.NodeIdLike, value: opcua.Variant) => new Promise<opcua.StatusCode>((res, rej) => {
                if (!shouldReject) {
                    res(new opcua.ConstantStatusCode({
                        description: "good message",
                        name: "OK",
                        value: 200
                    }))
                } else {
                    rej(new Error('error !'))
                }
            }))
        }
        opcua.OPCUAClient.create = (options: opcua.OPCUAClientOptions) => {
            return {
                connect: (hostname: string) => new Promise((res, rej) => {
                    expect(hostname).toEqual('endpoint')
                    res()
                }),
                createSession: () => new Promise((res, rej) => {
                    res(session)
                })

            } as any as opcua.OPCUAClient
        }
    });

    test('should connect and create session', async () => {
        let isSessionCreated = false
        opcua.OPCUAClient.create = (options: opcua.OPCUAClientOptions) => {
            return {
                connect: (hostname: string) => new Promise((res, rej) => {
                    expect(hostname).toEqual('endpoint')
                    res()
                }),
                createSession: () => new Promise((res, rej) => {
                    isSessionCreated = true;
                    res()
                }
                )

            } as any as opcua.OPCUAClient
        }

        const opcClient = new OpcClient('endpoint')
        await opcClient.connectClient()

        expect(isSessionCreated).toBe(true)
    });


    test('Call to getServerNode should call getIdNodesChildren', async () => {

        const nodes: OpcNode[] = [{
            Id: "id",
            DisplayName: "name"
        }]

        const opcClient = new OpcClient('endpoint')
        const spy = jest.spyOn(opcClient, 'getIdNodesChildren' as never).mockImplementation(() => true as never)

        await opcClient.connectClient()

        await opcClient.getServerNode(nodes)

        expect(spy).toHaveBeenCalledWith(ROOT_OPC_FOLDER, nodes)

    })

    test('Given a list of subscribed nodes when getIdNodesChildren then return the node list with subscription', async () => {

        const alreadySubscribed: OpcNode[] = [{
            Id: "ns=0;s=item.toto.item1",
            DisplayName: 'toto.item1'
        }]

        const rootBrowseResult: BrowseResult = {
            references: [{
                nodeClass: opcua.NodeClass.Object,
                nodeId: new opcua.ExpandedNodeId(opcua.NodeIdType.STRING, "item.toto", 0)
            } as ReferenceDescription,
            {
                nodeClass: opcua.NodeClass.Object,
                nodeId: new opcua.ExpandedNodeId(opcua.NodeIdType.STRING, "item._metaNode", 0)
            }
            ]
        } as BrowseResult

        const totoBrowseResult: BrowseResult = {
            references: [
                {
                    nodeClass: opcua.NodeClass.Variable,
                    nodeId: new opcua.ExpandedNodeId(opcua.NodeIdType.STRING, "item.toto.item1", 0)
                } as ReferenceDescription,
                {
                    nodeClass: opcua.NodeClass.Variable,
                    nodeId: new opcua.ExpandedNodeId(opcua.NodeIdType.STRING, "item.toto.item2", 0)
                } as ReferenceDescription
            ]
        } as BrowseResult

        const session: ClientSession = {
            browse: (id: string) => {
                return new Promise<BrowseResult>((res, rej) => {
                    if (id == ROOT_OPC_FOLDER) res(rootBrowseResult)
                    else res(totoBrowseResult)
                })
            }
        } as ClientSession

        opcua.OPCUAClient.create = (options: opcua.OPCUAClientOptions) => {
            return {
                connect: (hostname: string) => new Promise((res, rej) => {
                    expect(hostname).toEqual('endpoint')
                    res()
                }),
                createSession: () => new Promise((res, rej) => {
                    res(session)
                })

            } as any as opcua.OPCUAClient
        }

        const opcClient = new OpcClient('endpoint')
        await opcClient.connectClient()

        const node = await opcClient.getIdNodesChildren(ROOT_OPC_FOLDER, alreadySubscribed)

        expect(node).toEqual({
            toto: {
                id: "ns=0;s=item.toto",
                childs: {}
            }
        });

    });

})
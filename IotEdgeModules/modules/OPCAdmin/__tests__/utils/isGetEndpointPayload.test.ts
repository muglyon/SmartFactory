import OPCClientMock from '../../__mocks__/OPCClient.mock';

jest.mock('../../src/utils/OpcClient.ts', () => OPCClientMock);
import getEndpointAndNodes from '../../src/getEndpointAndNodes';

describe("Is Get Endpoint payload tests", () => {
    test("given a url already added it should not add this url in the OPCclient list", async () => {
        expect.assertions(1);
        const initState = {
            mockUrl1: {
                getServerNode: jest.fn(() => new Promise((resolve) => resolve()))
            }
        } as any;
        
        const testResult = await getEndpointAndNodes("mockUrl1", "", {
            EndpointUrl: "mockUrl1",
            OpcNodes: []
        },
        initState);

        expect(testResult.newOpcClientList).toBe(initState);

    });

    test("given a new url it should add this url in the OPCclient list", async () => {
        expect.assertions(2);
        const testResult = await getEndpointAndNodes("mockUrl2", "", {
            EndpointUrl: "mockUrl2",
            OpcNodes: []
        },
        {});
        const newOpcClientListKeys = Object.keys(testResult.newOpcClientList);

        expect(newOpcClientListKeys[0]).toBe("mockUrl2");
        expect(newOpcClientListKeys.length).toBe(1);
    });

    test("given a good params it should call getServerNode of OPCClient", async () => {
        expect.assertions(1);
        const getServerNodeMockFunction = jest.fn(() => new Promise((resolve) => resolve()));
        const initState = {
            mockUrl3: {
                getServerNode: getServerNodeMockFunction
            }
        } as any;

        await getEndpointAndNodes("mockUrl3", "", {
            EndpointUrl: "mockUrl3",
            OpcNodes: []
        },
        initState);

        expect(getServerNodeMockFunction).toBeCalled();

    });

    test("given a error in OPCClient it should reject the promise", async () => {
        expect.assertions(1);
        const getServerNodeMockFunction = jest.fn(() => new Promise((resolve, reject) => reject("test")));
        const initState = {
            mockUrl4: {
                getServerNode: getServerNodeMockFunction
            }
        } as any;

        await getEndpointAndNodes("mockUrl4", "", {
            EndpointUrl: "mockUrl4",
            OpcNodes: []
        },
        initState)
        .catch((test) => {
            expect(test).toBe("test");
        });

    });
});
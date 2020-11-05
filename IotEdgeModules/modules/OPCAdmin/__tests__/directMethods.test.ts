
import DirectMethods from '../src/directsMethods/DirectMethods'
import { ModuleClient } from 'azure-iot-device';
import { GET_NODES_METHOD } from '../src/constantes';

describe('DirectMethods tests', () => {


    test('Given the opc client when DirectMethods call then initialize all direct methods', async () => {
        const client: ModuleClient = {
            onMethod: jest.fn()
        } as any

        new DirectMethods(client);

        expect(client.onMethod).toHaveBeenCalledWith(GET_NODES_METHOD, expect.any(Function))
    });

})
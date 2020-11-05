import prepareMessage from '../../src/functions/prepareMessage';
import { DataInterface, PublishedItem } from '../../src/types/messageType';
import * as createJsonMessage from '../../src/functions/createJsonMessage';

describe('prepareMessage tests', () => {

    afterAll(() => {
        jest.resetModules();
    })
    const items: PublishedItem[] = [
        { DisplayName: 'base1.item1.sensor1', Value: { SourceTimestamp: "2019-11-25T10:57:41.0000000+00:00", Value: 3 } },
        { DisplayName: 'base1.item1.sensor2', Value: { SourceTimestamp: "2019-11-25T10:57:41.0000000+00:00", Value: 3 } },
        { DisplayName: 'base1.item2.sensor1', Value: { SourceTimestamp: "2019-11-25T10:57:41.0000000+00:00", Value: 2 } },
        { DisplayName: 'base1.item1.sensor1', Value: { SourceTimestamp: "2019-11-25T10:57:42.0000000+00:00", Value: 4 } },
        { DisplayName: 'base2.item1.sensor1', Value: { SourceTimestamp: "2019-11-25T10:57:43.0000000+00:00", Value: 5 } },
        { DisplayName: 'base1.item1.sensor3', Value: { SourceTimestamp: "2019-11-25T10:57:43.0000000+00:00", Value: 16 } },
        { DisplayName: 'base2.item2.sensor1', Value: { SourceTimestamp: "2019-11-25T10:57:42.0000000+00:00", Value: 1 } },
    ]

    it("prepareMessage should call createJsonMessage and return good items", () => {

        const spy = jest.spyOn(createJsonMessage, 'createJsonMessage')
        const initialData = {}

        const test = prepareMessage(items, initialData)

        expect(spy).toHaveBeenCalledTimes(items.length)

        expect(test.items).toEqual(
            {
                "base1":
                {
                    "item1":
                        [
                            {
                                "timestamp": new Date("2019-11-25T10:57:41.000Z"),
                                "sensor1": 3,
                                "sensor2": 3
                            },
                            {
                                "sensor1": 4,
                                "sensor2": 3,
                                "timestamp": new Date("2019-11-25T10:57:42.000Z")
                            },
                            {
                                "sensor1": 4,
                                "sensor2": 3,
                                "timestamp": new Date("2019-11-25T10:57:43.000Z"),
                                "sensor3": 16
                            }
                        ],
                    "item2": [{
                        "timestamp": new Date("2019-11-25T10:57:41.000Z"),
                        "sensor1": 2
                    }]
                },
                "base2": {
                    "item1": [
                        {
                            "timestamp": new Date("2019-11-25T10:57:43.000Z"),
                            "sensor1": 5
                        }
                    ],
                    "item2": [
                        {
                            "timestamp": new Date("2019-11-25T10:57:42.000Z"),
                            "sensor1": 1
                        }
                    ]
                }
            }
        )

        expect(test.newInitialData).toEqual({
            "base1": {
                "item1": {
                    "sensor1": 4,
                    "sensor2": 3,
                    "sensor3": 16
                },
                "item2": {
                    "sensor1": 2
                }
            },
            "base2": {
                "item1": {
                    "sensor1": 5
                },
                "item2": {
                    "sensor1": 1
                }
            }
        })
    })
})
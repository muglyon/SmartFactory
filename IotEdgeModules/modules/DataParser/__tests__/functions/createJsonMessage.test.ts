import { createJsonMessage } from '../../src/functions/createJsonMessage';
import { PublishedItem } from '../../src/types/messageType';


describe("createJsonMessage tests", () => {
    
    it("call createJsonMessage with empty data should create everything", () => {
        const item: PublishedItem = { DisplayName: 'base1.usine1.item1.sensor1', Value: { SourceTimestamp: "2019-11-25T10:57:41.0000000+00:00", Value: 3 } }
        const data = {}
        const initialData = {}
        createJsonMessage(data, item.DisplayName.split('.'), initialData, item)

        expect(data).toEqual({
            base1: {
                usine1: {
                    item1: [
                        {
                            sensor1: 3,
                            timestamp: new Date("2019-11-25T10:57:41.0000000+00:00")
                        }
                    ]
                }
            }
        })

        expect(initialData).toEqual({
            base1: {
                usine1: {
                    item1:
                    {
                        sensor1: 3
                    }
                }
            }
        })

    })

    it("call createJsonMessage multiple time should complete datas", () => {
        const items: PublishedItem[] = [
            { DisplayName: 'base1.usine1.item1.sensor1', Value: { SourceTimestamp: "2019-11-25T10:57:41.0000000+00:00", Value: 3 } },
            { DisplayName: 'base1.usine1.item1.sensor2', Value: { SourceTimestamp: "2019-11-25T10:57:41.0000000+00:00", Value: 4 } },
            { DisplayName: 'base1.usine2.item1.sensor1', Value: { SourceTimestamp: "2019-11-25T10:57:41.0000000+00:00", Value: 5 } },
            { DisplayName: 'base1.usine1.item1.sensor1', Value: { SourceTimestamp: "2019-11-25T10:57:42.0000000+00:00", Value: 2 } }
        ]
        const data = {}
        const initialData = {}
        items.forEach((item) => {

            createJsonMessage(data, item.DisplayName.split('.'), initialData, item)
        })

        expect(data).toEqual({
            base1: {
                usine1: {
                    item1: [
                        {
                            sensor1: 3,
                            sensor2: 4,
                            timestamp: new Date("2019-11-25T10:57:41.0000000+00:00")
                        },
                        {
                            sensor1: 2,
                            sensor2: 4,
                            timestamp: new Date("2019-11-25T10:57:42.0000000+00:00")
                        }
                    ]
                },
                usine2: {
                    item1: [
                        {
                            sensor1: 5,
                            timestamp: new Date("2019-11-25T10:57:41.0000000+00:00")
                        }
                    ]
                }
            }
        })

        expect(initialData).toEqual({
            base1: {
                usine1: {
                    item1: {
                        sensor1: 2,
                        sensor2: 4
                    }
                },
                usine2: {
                    item1: {
                        sensor1: 5
                    }
                }
            }
        })
    })

    it("call createJsonMessage with linked initial datas should complete datas", () => {
        const item: PublishedItem = { DisplayName: 'base1.usine1.item1.sensor2', Value: { SourceTimestamp: "2019-11-25T10:57:41.0000000+00:00", Value: 4 } }
        const data = {}
        const initialData = {
            base1: {
                usine1: {
                    item1:
                    {
                        sensor1: 3
                    }
                }
            }
        }
        createJsonMessage(data, item.DisplayName.split('.'), initialData, item)

        expect(data).toEqual({
            base1: {
                usine1: {
                    item1: [
                        {
                            sensor1: 3,
                            sensor2: 4,
                            timestamp: new Date("2019-11-25T10:57:41.0000000+00:00")
                        }
                    ]
                }
            }
        })

        expect(initialData).toEqual({
            base1: {
                usine1: {
                    item1:
                    {
                        sensor1: 3,
                        sensor2: 4
                    }
                }
            }
        })

    })

    it("call createJsonMessage with unlinked initial datas should complete datas", () => {
        const item: PublishedItem = { DisplayName: 'base1.usine2.item1.sensor2', Value: { SourceTimestamp: "2019-11-25T10:57:41.0000000+00:00", Value: 4 } }
        const data = {}
        const initialData = {
            base1: {
                usine1: {
                    item1:
                    {
                        sensor1: 3
                    }
                }
            }
        }
        createJsonMessage(data, item.DisplayName.split('.'), initialData, item)

        expect(data).toEqual({
            base1: {
                usine2: {
                    item1: [
                        {
                            sensor2: 4,
                            timestamp: new Date("2019-11-25T10:57:41.0000000+00:00")
                        }
                    ]
                }
            }
        })

        expect(initialData).toEqual({
            base1: {
                usine1: {
                    item1:
                    {
                        sensor1: 3,
                    }
                },
                usine2: {
                    item1: {

                        sensor2: 4
                    }
                }
            }
        })

    })

})
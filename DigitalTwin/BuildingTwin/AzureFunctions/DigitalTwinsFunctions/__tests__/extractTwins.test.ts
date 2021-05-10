import extractTwins from "../HubToDT/extractTwins"

describe("extractTwins tests", () => {
    it("if no TwinId, should return all the object", () => {
        const message = {
            key1: 1,
            key2: "2",
            key3: {
                subKey1: new Date()
            }
        }
        const deviceId = "Device"

        expect(extractTwins(deviceId, message)).toEqual({
            [deviceId]: message
        })
    })

    it('should return all the objects', () => {
        const message = {
            key1: 1,
            Battery: {
                TwinId: 'Battery',
                current: 80,
                voltage: 120,
                constructor: {
                    TwinId: "Philips",
                    Location: 'Lyon',
                    Age: 30
                }
            },
            Station: {
                Moteurs: [{
                    TwinId: "Moteur1",
                    Constructeur: "Dyson"
                },
                {
                    TwinId: "Moteur2",
                    Constructeur: "Toto"
                }],
                Bases: ["Lyon", "Toulouse"],
                BatteryName: "Battery"
            }
        }

        const deviceId = "Device"


        const result = extractTwins(deviceId, message)
        console.log(result)
        expect(result).toEqual({
            Device: {
                key1: 1,
                Station: {
                    Bases: ["Lyon", "Toulouse"],
                    BatteryName: "Battery"
                }
            },
            Battery: {
                current: 80,
                voltage: 120,
            },
            Philips: {
                Location: 'Lyon',
                Age: 30
            },
            Moteur1: {
                Constructeur: "Dyson"
            },
            Moteur2: {
                Constructeur: "Toto"
            }
        })
    })
})
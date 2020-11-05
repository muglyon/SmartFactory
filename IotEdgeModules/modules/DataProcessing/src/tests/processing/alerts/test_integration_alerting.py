from unittest import TestCase
from processing.alerts.alerting import alerting


class Test(TestCase):
    def test_given_datas_and_rules_then_alerts_should_be_corrects(self):
        self.maxDiff = None
        rules = [{
                "item": "Key1.Item1.Value",
                "operator": "gte",
                "value": 95
        },
        {
                "item": "Key1.Item2.Value",
                "operator": "eq",
                "value": 2
        },
        {
                "item": "Key1.Item2.Value",
                "operator": "badOperator",
                "value": 10
        },
        {
                "item": "Key2.Item1.Value",
                "operator": "gt",
                "value": "badValue"
        }]

        datas = {
            "Key1": {
                "Item1": [{
                    "Value": 15,
                    "timestamp": '1'
                }, 
                {
                    "Value": 98,
                    "timestamp": '2'
                }
                ],
                "Item2": [
                {
                    "Value": 98,
                    "timestamp": '1'
                },
                {
                    "Value": 2,
                    "timestamp": '2'
                }
            ]
            },
            "Key2": {
                "Item1": [
                {
                    "Value": 2,
                    "timestamp": '1'
                }
                ]
            }
        }

        self.assertListEqual(alerting(datas, rules), [
            "'98' supérieur à '95' pour la mesure 'Key1.Item1.Value' le '2'",
            "'2' égal à '2' pour la mesure 'Key1.Item2.Value' le '2'",
            "Error during processing Key2.Item1.Value : Bad operator gt for compare '2' and 'badValue'"
        ])
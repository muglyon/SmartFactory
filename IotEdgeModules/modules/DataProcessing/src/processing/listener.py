import json
from azure.iot.device.iothub.models import Message
from datetime import datetime
import os
import constantes
from LoggerSingleton import EdgeLogger
from .alerts.alerting import alerting

async def input_listener(module_client):

    if "ALERT_RULES" in os.environ:
        alert_rules = json.loads(os.environ.get("ALERT_RULES"))
    else:
        with open('./src/rules.json') as f:
            alert_rules = json.loads(f.read())

    for rules in alert_rules:
        if 'operator' not in rules or rules['operator'] not in ["eq", "neq", "lt", "lte", "gt", "gte"]:
            EdgeLogger.logger.error("Unknown operator {} in rule {}".format(rules['operator'], json.dumps(rules)))

    while True:
        try:
            input_message = await module_client.receive_message_on_input(constantes.INPUT_NAME)  # blocking call
            EdgeLogger().logger.info("Receive message {}".format(input_message))
            alerts = alerting(json.loads(input_message.data)[constantes.DATA_KEY], alert_rules)
            
            await module_client.send_message_to_output(input_message, constantes.OUTPUT_NAME)
            if len(alerts) > 0:
                message = {
                    "type": "alert",
                    "alerte": alerts
                }

                EdgeLogger().logger.info("Send alerts : {}".format(json.dumps(message)))

            
                await module_client.send_message_to_output(Message(json.dumps(message)), constantes.OUTPUT_NAME)

        except Exception as error:
            EdgeLogger().logger.error(error)
from .operator_processing import operator_processing
from .message_creator import message_creator
from constantes import DATA_DATE_NAME


def alerting(datas, rules):
    alerts = []
    for rule in rules:

        array_value = []
        deep_data = datas
        should_check = True
        splitted_key = rule["item"].split('.')

        for key in splitted_key:
            if key in deep_data:
                if (isinstance(deep_data[key], list)):
                    array_value = deep_data[key]
                    break
                else:
                    deep_data = deep_data[key]
            else:
                should_check = False

        if should_check == True:
            for value in array_value:
                try:
                    if splitted_key[-1] in value \
                            and operator_processing(value[splitted_key[-1]], rule["value"], rule["operator"]):
                        alerts.append(
                            message_creator(
                                rule["item"],
                                value[splitted_key[-1]],
                                rule["value"],
                                value[DATA_DATE_NAME],
                                rule["operator"]
                            )
                        )
                except Exception as e:
                    alerts.append("Error during processing {} : {}".format(rule["item"], str(e)))

    return alerts

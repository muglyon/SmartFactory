def message_creator(key, value1, value2, timestamp, op):
    processor = {
        "eq": "'{}' égal à '{}' pour la mesure '{}' le '{}'".format(value1, value2, key, timestamp),
        "neq": "'{}' différent de '{}' pour la mesure '{}' le '{}'".format(value1, value2, key, timestamp),
        "gt": "'{}' supérieur ou égal à '{}' pour la mesure '{}' le '{}'".format(value1, value2, key, timestamp),
        "gte": "'{}' supérieur à '{}' pour la mesure '{}' le '{}'".format(value1, value2, key, timestamp),
        "lt": "'{}' inférieur ou égal à '{}' pour la mesure '{}' le '{}'".format(value1, value2, key, timestamp),
        "lte": "'{}' inférieur à '{}' pour la mesure '{}' le '{}'".format(value1, value2, key, timestamp),
    }

    return processor.get(op, None)


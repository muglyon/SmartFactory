def operator_processing(value1, value2, op):
    try:
        if op == "eq":
            return str(value1) == str(value2)
        if op == "neq":
            return str(value1) != str(value2)
        if op == "gt":
            return float(value1) > float(value2)
        if op == "gte":
            return float(value1) >= float(value2)
        if op == "lt":
            return float(value1) < float(value2)
        if op == "lte":
            return float(value1) <= float(value2)

    except Exception as e:
        print(e)
        raise Exception("Bad operator {} for compare '{}' and '{}'".format(op, str(value1), str(value2)))
    
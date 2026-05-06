__ff_has_output__ = False
__ff_output__ = None


def variable(name, default=None):
    key = str(name)
    variables = globals().get("variables", {})
    if isinstance(variables, dict) and key in variables:
        return variables[key]
    return globals().get(key, default)


def variable_required(name):
    key = str(name)
    variables = globals().get("variables", {})
    if isinstance(variables, dict) and key in variables:
        return variables[key]
    if key in globals():
        return globals()[key]
    raise KeyError(f"Variable '{name}' not found in context")


def set_result(value):
    globals()["__ff_output__"] = value
    globals()["__ff_has_output__"] = True
    return value

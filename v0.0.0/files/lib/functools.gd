var _methods = {"bind": bind}

func bind(callback, ...values):
	print("Functools (gd) values: ", values)
    return callback.bindv(values)
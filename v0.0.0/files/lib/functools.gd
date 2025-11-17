var _methods = {"bind": bind}

func bind(callback, ...values):
	print("Functools (gd) values: ", values)
	return func(args): return callback.call(values + args)
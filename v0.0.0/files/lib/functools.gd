var _methods = {"bind": bind}

func bind(callback, ...values):
	print("Functools (gd) values: ", values)
	return func(...args): print("Bound lambda args: ", args, ", bound values: ", values); return callback.call(values + args)
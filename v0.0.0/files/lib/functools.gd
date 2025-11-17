var _methods = {"bind": bind}

func bind(args_array):
	# args_array = [callback, arg1, arg2, ...]
	var callback = args_array[0]
	var bind_args = args_array.slice(1)  # Everything after callback
	return callback.bindv(bind_args)
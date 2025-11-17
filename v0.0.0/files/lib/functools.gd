var _methods = {"bind": bind}

func bind(callback, ...values):
    return func(args): return callback.call(...values + args)
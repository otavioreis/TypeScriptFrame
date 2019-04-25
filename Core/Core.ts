var Util = {
    emptyFn: function () { },
    abstractFn: function () {
        throw new Error('this method is abstract and should be implemented on derived class');
    },
    isDefined: function (value:any) {
        return typeof value !== 'undefined';
    },
	isEmpty: function(value:any) {
		return value === null || !this.isDefined(value);
	},
    isObject: function (value:any) {
        return value ? Object.prototype.toString.call(value) == '[object Object]' : false;
    },
    apply: function (obj:any, config:any) {
        if (config) {
            for (var name in config) {
                obj[name] = config[name];
            }
        }

        return obj;
    },
    String: {
        _formatRegex: /\{(\d+)\}/g,
        format: function (format:any) {
            var args = Array.prototype.slice.apply(arguments, [1]);
            return format.replace(this._formatRegex, function (match:any, i:any) {
                return args[i];
            });
        }
    },
    Function: {
        bind: function (fn:any, scope:any) {
            return function () {
                return fn.apply(scope, arguments);
            }
        }
    }
};

function baseObj(config:any) { 
}
////@ts-ignore
//baseObj.prototype.getCtorName = () => this.constructor.name.replace(/__/g, '.');
////@ts-ignore
//baseObj.prototype.ctor = (config:any) => Util.apply(this, config);


baseObj.prototype.getCtorName = function () {
    return this.constructor.name.replace(/__/g, '.');
}

baseObj.prototype.callBase = (args:any) => {
    //@ts-ignore
    var method: any = this.callBase.caller;

    if (!method.$owner) {
        method = method.caller;
    }
    //@ts-ignore
    return method.$owner.prototype[method.$name].apply(this, args || []);
};
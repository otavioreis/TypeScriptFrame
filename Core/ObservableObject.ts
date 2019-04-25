namespace Core {

    export interface IObservableObjectConfig {
        listeners?: any;
    }

    export class ObservableObject<T extends IObservableObjectConfig> extends ObjectBase {
        private _listeners?: any;
        config: T = <T><any>null;

        constructor(config: T) {
            super(config);
            var me = this;

            me.config = config;

            me.initEvents(config.listeners);
        }

        initEvents(listeners: any) {
            var me: ObservableObject<T> = this,
                l, scope;

            if (!me._listeners) {
                me._listeners = {};
            }

            if (listeners) {
                if (listeners.scope) {
                    scope = listeners.scope;
                    delete listeners.scope;
                }
                else {
                    scope = null;
                }

                for (var name in listeners) {
                    l = listeners[name];

                    if (Util.isObject(l)) {
                        me.addListener(name, l.fn, l.scope || scope);
                    }
                    else {
                        me.addListener(name, l, scope);
                    }
                }
            }
        }

        fireEvent(evtName: string, args?: any) {
            var me: ObservableObject<T> = this,
                cache = me._listeners[evtName],
                i = cache ? cache.length : 0,
                listener;

            while (i--) {
                listener = cache[i];
                listener.fn.apply(listener.scope || me, args);
            }
        }

        addListener(evtName: string, fn: any, scope: any) {
            var me: ObservableObject<T> = this,
                cache = me._listeners[evtName] || [];

            cache.push({ fn: fn, scope: scope });

            me._listeners[evtName] = cache;
        }

        removeListener(evtName: string, fn: any, scope: any) {
            var me: ObservableObject<T> = this,
                cache = me._listeners[evtName],
                listener,
                i = cache ? cache.length : 0;

            while (i--) {
                listener = cache[i];

                if (listener.fn == fn && listener.scope == scope) {
                    cache.splice(i, 1);
                    break;
                }
            }

            me._listeners = cache;
        }


    }
}

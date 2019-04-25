namespace Frame {
    export interface IExtension {

    }

    export class Context {
        static ctxs: any = {};

        currentCulture: any = null;
        currentDate: any = null;
        currentDay: any = null;
        currentMonth: any = null;
        currentYear: any = null;
        baseUrl: any = null;
        apiBaseUrl: any = null;
        externLocation: any = null;
        isLocal: boolean = false;
        user: any = null;
        page: any = null;

        constructor(attrs: any) {
            for (let key in attrs) {
                //@ts-ignore
                this[key] = attrs[key];
            }
        }

        static beginContext(config: any, scopeFunc?: any): any {
            var me = this,
                ctx: any = me.getContext();

            Frame.Debug.assert(config, 'argument "config" cannot be null or undefined');

            config.id = Frame.Utils.newGuid();

            if (ctx) {
                var newCtx = Object.assign(new Context({}), { ...ctx, ...config });

                //for (let key in config) {
                //    newCtx[key] = config[key];
                //}
                me.ctxs[config.id] = newCtx; // to generate a new object instance
            } else {
                me.ctxs[config.id] = new Context(config);
            }

            ctx = me.getContext();

            if (scopeFunc && typeof scopeFunc == 'function') {
                scopeFunc(ctx);
                me.closeContext(ctx.id);
            } else {
                return ctx;
            }
        }
        static getContext(): Context {
            var me = this,
                ctxs: any = me.ctxs,
                keys: any = Object.keys(ctxs);

            if (keys.length <= 0) {
                return <Context><any>null;
            }

            return ctxs[keys[keys.length - 1]];
        }
        static closeContext(ctxId: string): void {
            var me = this,
                ctxs: any = me.ctxs,
                keys: any = Object.keys(ctxs);

            if (ctxId) {
                delete ctxs[ctxId];
            } else {
                delete ctxs[keys[keys.length - 1]];
            }
        }

        getExtension<T extends IExtension>(name: string): T {
            switch (name) {
                case "RemoteProxy":
                    return <T><any> new Frame.Remote.Command.ProxyAsync;
                
                default:
                    return <T><any>null;
            }
        }


    }
};
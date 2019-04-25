namespace Core {
    export interface DelayedTaskOptions {
        fn: any;
        scope: any;
        args: any;
        delayTime: number;

    }

    export class DelayedTask {
        /**
        * @public properties
        */
        fn: any = null;
        scope: any = null;
        args: any = null;

        /**
        * @property {number} delay time The delay time in milliseconds
        * @default 500
        */
        delayTime: number = 500;

        /**
        * @private properties
        */
        private _timeoutId: any = null;

        /**
        * @constructor
        */
        constructor(attrs: DelayedTaskOptions) {
            var me = this;
        }

        /**
        * @public methods
        */
        run() {
            var me = this,
                taskFn = Util.Function.bind(me.fn, me.scope);

            me.cancel();
            me._timeoutId = setTimeout(function () { taskFn() }, me.delayTime);
        }

        cancel() {
            var me = this;

            if (me._timeoutId) {
                clearTimeout(me._timeoutId);
                me._timeoutId = null;
            }
        }
    }
}
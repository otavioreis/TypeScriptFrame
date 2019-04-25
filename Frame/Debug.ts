namespace Frame {
    export class Debug{

        static log(msg:string) {
             if (Frame.runtime.debug) {
                 if (window.console && window.console.log) {
                     console.log(msg);
                 }
             }
         }
        static assert(condition:any, message: string) {
            var me = this;

            if (!condition) {
                me.error(message); 
            }
        }
        static error(message:string) {
            if (Frame.runtime.debug) {
                var me = this;

                if (typeof Error !== "undefined") {
                    throw new Error(message);
                }

                throw message; //fallback
            }
        }   
    }
    export class runtime{
        static debug: boolean;
    }
}
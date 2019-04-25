
namespace Frame{
    export class Utils {
    
        static objToQueryStr(obj: any): string {
            if (obj) {
                return jQuery.param(obj);
            } else {
                return ''; 
            } 
        }
         

        static queryStrToObj(queryStr: string): any {
            if (queryStr) {
                var re = /([^&=]+)=?([^&]*)/g;
                var decodeRE = /\+/g;  // Regex for replacing addition symbol with a space
                var decode = (str:string) => decodeURIComponent(str.replace(decodeRE, " "));
                var params:any = {}, e;
                while (e = re.exec(queryStr)) {
                    var k = decode(e[1]), v = decode(e[2]);
                    if (k.substring(k.length - 2) === '[]') {
                        k = k.substring(0, k.length - 2);
                        (params[k] || (params[k] = [])).push(v);
                    }
                    else params[k] = v;
                }
                return params;
            }
        }
        static format(str:string, args: any) {
            if (str) {
                for (var i = 0; i < args.length; i++) {
                    var regexp = new RegExp('\\{' + i + '\\}', 'gi');
                    str = str.replace(regexp, args[i]);
                }
            }
            return str; 
        }
        static newGuid(): string {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        static isDefined(value: any) {
            return typeof value !== 'undefined';
        }
        static isDefinedAndNotNull(value: any) {
            return typeof value !== 'undefined' && value != null;
        }
    }
}
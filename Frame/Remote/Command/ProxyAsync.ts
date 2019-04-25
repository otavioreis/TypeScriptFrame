namespace Frame.Remote.Command {
    type httpMethodTypes = "GET" | "POST";

    export class ProxyAsync implements IProxy {

        private _useBaseUrl: boolean = true;

        constructor(useBaseUrl: boolean = true) {
            var me = this;

            me._useBaseUrl = useBaseUrl;
        }

        async processCommand(httpMethod: httpMethodTypes, commandUrl: string, bodyParams?: any, isFormData?: any, timeout?: any, textTypeResponse?: any): Promise<any> {
            var me = this,
                ctx = <any>Frame.Context.getContext(),
                accept: any = {},
                dataType,
                body,
                contentType;

            if (!textTypeResponse) {
                accept.json = 'application/json';
                dataType = 'json';
            }

            //deprecated
            if (!ctx.isLocal && !textTypeResponse) {
                accept.json = 'application/json';
                dataType = 'json';
            }

            if (!isFormData) {
                contentType = 'application/json';

                if (httpMethod === 'POST') {
                    body = JSON.stringify(bodyParams);
                } else {
                    body = bodyParams;
                }
            } else {
                contentType = false;
                body = bodyParams;
            }

            if (!bodyParams) {
                body = '';
            }

            var ajaxOptions = {
                //hard-coded
                async: true,
                cache: false,
                global: true,
                ifModified: false,
                isLocal: false,
                processData: false,
                timeout: timeout ? timeout : 120000,

                //from ctx
                accept: accept,
                dataType: dataType,
                contentType: contentType,
                headers: {},

                //from method
                data: body,
                url: me._useBaseUrl ? (ctx.baseUrl + commandUrl) : commandUrl,
                method: httpMethod,

                //local
                beforeSend: (request: any): void => {
                    request.setRequestHeader("X-Frame-API", 1);
                },
                xhr: (): XMLHttpRequest => {
                    // @ts-ignore
                    let xhr: XMLHttpRequest = jQuery.ajaxSettings.xhr();
                    return xhr;
                }
            };

            //from ctx
            if (ctx.user && ctx.user.apiKey && !ctx.isLocal) {
                ajaxOptions.headers = {
                    Authorization: 'Basic ' + ctx.user.apiKey
                }
            }

            return await me._doAjax(ajaxOptions);
        }

        /**
        * @private static methods
        */
        private async _doAjax(options: any): Promise<any> {
            var me = this;

            return new Promise<any>((resolve, reject) => {
                jQuery.ajax(options)
                    .done(function (jqXHR: any, textStatus: string) {
                        let responseAjax = me._responseAjax(jqXHR, textStatus);
                        resolve(responseAjax);
                    })
                    .fail(function (jqXHR: any, textStatus: string) {
                        let responseAjax = me._responseAjax(jqXHR, textStatus);
                        resolve(responseAjax);
                    });
            });
        }
        private _responseAjax(jqXHR: any, textStatus: string): object {
            var result = { success: false, content: null, reason: textStatus },
                content = jqXHR;

            switch (textStatus) {
                //success
                case "success":
                case "notmodified":
                case "nocontent":
                    result.success = true;
                    break;
                //error
                case "error":
                case "timeout":
                case "abort":
                case "parsererror":
                default:
                    result.success = false;
                    break;
            }

            if (result.success)
                result.content = content;

            return result;
        }

    }

}
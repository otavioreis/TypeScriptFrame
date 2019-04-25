namespace Frame.Controls.Base {

    export interface IPageBaseConfig extends IControlConfig{
        title?: any;
        menuIndex?: number;
        forceClose?: boolean;
        fullScreen?: boolean;
        innerPages: any;
        listenHashChange?: boolean;
    }

    export class PageBase<T extends IPageBaseConfig> extends Frame.Controls.Control<T> {

        /**
        * @public virtual properties
        */
      
        /**
        * @protected virtual properties
        */
        _ctx: any;

        /**
        * @constructor
        */
        constructor(config: any) {
            super(config);

            var me = this;
            //me.initEvents();

            me.config.innerPages = [];

            //me.initEvents();

            var $body = $('body');
            if (me.config.id) {
                $body.attr('id', me.config.id);
            }
            me._ctx = Frame.Context.beginContext({
                page: me
            });

            if (me._ctx.onCommandStart && me._ctx.onCommandEnd) {
                $(document).bind('ajaxStart', function () {
                    me._ctx.onCommandStart();
                }).bind('ajaxStop', function () {
                    me._ctx.onCommandEnd();
                });
            }

            if (me.config.menuIndex != null) {
                $('.page-sidebar-inner li:eq(' + me.config.menuIndex + ')').addClass('active');
            }

            $body.on('mouseover mouseenter', '.tooltipster', function () {
                //@ts-ignore
                var $this: any = $(this);

                $this.tooltipster({
                    position: $this.attr('position'),
                    offsetX: $this.attr('offsetX'),
                    contentAsHTML: true,
                    multiple: true,
                    functionAfter: function () {
                        $this.tooltipster('disable');
                    }
                });

                $this.tooltipster('enable');

                $this.tooltipster('show');
            });

            me.getJQuery().find('.closeModal').on('click', function () {
                me.close();
            });

            //Internal Iframe need support do keypress (ESC) to close
            if (!me.config.fullScreen) {
                $(document).keyup(function (e) {
                    if (e.keyCode == 27 && $('.modal').length == 0) { // escape key maps to keycode `27`
                        me.close();
                    }
                });

                $body.fadeIn('slow');
            }

            me.fireEvent('load');

            me.onLoaded();
        }

        onLoaded() : void{
            var me: any = this;

            me.loaded = true;

            //if (!me.isModal())
            window.onpopstate = history.pushState = function () { me.fireEvent('hashChange'); return false; }

            me.fireEvent('hashChange');
        }


        hashChange(): void {
            var me: any = this,
                hash = window.location.hash,
                decodedHash,
                hashObj;

            if (me.listenHashChange && hash && hash != '#_' && hash != '#') {
                //decodedHash = decodeURIComponent(hash);
                hashObj = Frame.Utils.queryStrToObj(hash.substring(1)); //cut the first '#' char

                if (hashObj.c) {
                    if (me[hashObj.c]) {
                        me[hashObj.c](hashObj.a);
                    } else {
                        me.showError('Desculpe, essa página não existe');
                    }
                }
            } else if (me.innerPages.length > 0) {
                var lastPage = me.innerPages[me.innerPages.length - 1];
                lastPage.close();
                me.innerPages = me.innerPages.slice(0, -1);
            }
        }


        /**
        * @public virtual methods
        */
        reload() {
            var me = this,
                ctx = Frame.Context.getContext(),
                externLocation = ctx.externLocation;
            if (externLocation) {
                me.fireExternalEvent('reload');
            } else {
                if (window.parent) {
                    (window as any).parent['modalReload_' + this.config.id]();
                } else {
                    window.location.reload();
                }
            }
        }

        close() {
            var me = this,
                $ctrl = me.getJQuery(),
                ctx = Frame.Context.getContext(),
                externLocation = ctx.externLocation;

            if (externLocation) {
                me.fireExternalEvent('close');
            } else {
                var closeCallback = (window as any).parent['modalCallbackClose_' + this.config.id];

                if (me.onClose && !me.config.forceClose) {
                    if (me.onClose()) {
                        if (closeCallback)
                            closeCallback();
                    }
                } else {
                    if (closeCallback)
                        closeCallback();
                }
            }
        }
        showError(message: string, errors?: any) {
            var me = this;

            var errorsAsStr = me._getErrorsAsHtmlString(errors);
            var teste = {
                teste: 1,
                nome: 'teste'
            }
            new Frame.Controls.Notification({ type: 'error', message: (errorsAsStr && errorsAsStr.indexOf('Id de correla') == -1 ? errorsAsStr : message) }); //indexOf to avoid 500 message with correlationId from API
            //});
        }

        callParentCallback(result: any, pageId: string) {
            var me = this,
                ctx = Frame.Context.getContext();

            if (ctx.externLocation) {
                me.fireExternalEvent('callback', result);
            } else {
                (window as any).parent['modalCallback_' + (pageId ? pageId : this.config.id)](result);
            }
        }
        onClose() { return true; }
        destroy(): void {
            var me = this;

            Frame.Context.closeContext(me._ctx.id);
        }
        isModal() {
            var ctx = Frame.Context.getContext();

            if (ctx.externLocation) {
                return true;
            } else {
                var closeCallback = (window as any).parent['modalCallbackClose_' + this.config.id];
                return closeCallback ? true : false;
            }
        }
        fireExternalEvent(eventName: string, args?: any): void {
            window.parent.postMessage({
                eventName: eventName,
                args: args
            }, '*');
        }
        copyToClipboard(text: string, callback: any, preserveLineBreak: any): void {
            var textArea: any = document.createElement("textarea");
            textArea.style.position = 'fixed';
            textArea.style.top = 0;
            textArea.style.left = 0;
            textArea.style.width = '2em';
            textArea.style.height = '2em';
            textArea.style.padding = 0;
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            textArea.style.background = 'transparent';

            textArea.value = text;

            document.body.appendChild(textArea);


            if (preserveLineBreak != undefined && preserveLineBreak === true) {
                var selection: any = document.getSelection();
                var range = document.createRange();
                range.selectNode(textArea);
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                textArea.select();
            }


            try {
                var successful = document.execCommand('copy');
                if (successful) {
                    callback({ success: true });
                }
                else {
                    callback({ success: false });
                }
            } catch (err) {
                callback({ success: false });
            }

            document.body.removeChild(textArea);
        }
        removeUrlHash() {
            window.location.hash = '#_';
        }

        /**
        * @event listeners
        */



        showLoading() {
            var me = this,
                $ctrl = me.getJQuery();

            $('<div class="page-loading"></div>').css({
                position: "fixed",
                width: "100%",
                height: "100%",
                left: 0,
                top: 0,
                zIndex: 1000000,  // to be on the safe side
                background: "url(/static/assets/images/reload2.gif) no-repeat 50% 50%"
            }).appendTo($ctrl.css("position", "relative"));
        }

        hideLoading() {
            var me = this,
                $ctrl = me.getJQuery();

            $ctrl.find('.page-loading').remove();
        }

        /**
        * @private methods
        */
        _getErrorsAsHtmlString(errors: any) {
            var errorsAsStr = '';

            if (errors && errors.length > 0) {
                var i = 0;
                for (var error in errors) {
                    errorsAsStr += errors[error].Message || errors[error].mensagem; //Message is from AJAX local and mensagem is from Frame API

                    if (errors.length > 1 && i < (errors.length - 1))
                        errorsAsStr += '<br />';

                    i++;
                }
            }

            return errorsAsStr;
        }
    }
}
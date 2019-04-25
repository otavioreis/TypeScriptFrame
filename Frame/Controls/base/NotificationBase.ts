namespace Frame.Controls.Base {

    export interface INotificationBaseConfig extends IControlConfig{
        type?:string;
        closeButton?:boolean;
        title?:string;
        message?:string;
        timeOut?: number;
        position?: string;
        hover?: boolean;
    }

    export class NotificationBase<T extends INotificationBaseConfig> extends Frame.Controls.Control<T>{
        /**
        * @constructor
        */
       private _$toastr:any;

        constructor(config:T) {
            super(config);
            var me:any = this,
                $ctrl;

            
            
            // @ts-ignore
            toastr.options = {
                "closeButton": me.closeButton,
                "debug": false,
                "newestOnTop": false,
                "progressBar": false, //(me.type == 'error' ? true : false),
                "positionClass": "toast-" + me.position,
                "preventDuplicates": true,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": me.timeOut,
                "extendedTimeOut": "5000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            };

            // @ts-ignore
            me._$toastr = toastr[me.type](me.message, me.title);

            if (!me.hover) {
                me._$toastr.unbind('mouseenter mouseleave');
            }

            if (me.type == 'load')
            {
                me._$toastr.stop().fadeIn();
            }
        }

        /**
        * @public virtual methods
        */

        destroy():void {
            var me = this;

            me._$toastr.fadeOut(function () {
                if (me._$toastr.closest('#toastr-container').find('.toast').length <= 1) {
                    me._$toastr.closest('#toastr-container').remove();
                }

                $(me).remove();
            });
        }
    }   
}
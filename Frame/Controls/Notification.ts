
namespace Frame.Controls {
    export interface INotificationConfig extends Frame.Controls.Base.INotificationBaseConfig{

    }
    export class Notification extends Frame.Controls.Base.NotificationBase<INotificationConfig>{
        constructor(config:INotificationConfig) {
            super(config);
            var me:any = this;
        }
    }
}
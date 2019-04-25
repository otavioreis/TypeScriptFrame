namespace Frame.Controls {
    export interface IPageConfig extends Frame.Controls.Base.IPageBaseConfig {

    }

    export class Page extends Frame.Controls.Base.PageBase<IPageConfig>{

        constructor(config?: IPageConfig) {
            super(config);
            var me = this;

            var ctx = Frame.Context.getContext();

            ctx.page = me;

        }
    }
}
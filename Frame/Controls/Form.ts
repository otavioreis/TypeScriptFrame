namespace Frame.Controls {

    export interface IFormConfig extends Frame.Controls.Base.IFormBaseConfig {

    }

    export class Form extends Frame.Controls.Base.FormBase<IFormConfig> {

        constructor(config: IFormConfig) {
            super(config);
        }
    }
}
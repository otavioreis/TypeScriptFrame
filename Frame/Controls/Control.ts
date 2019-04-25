namespace Frame.Controls {
    
    export interface IControlConfig extends Core.IObservableObjectConfig {
        id?: string;
        parentControl?: any;
        controls?: any;
        disabled?: boolean;
        hidden?: boolean;
        value?: any;
        handler?: any;
        store?: any;
    }

    export class Control<T extends IControlConfig> extends Core.ObservableObject<T>   {

        constructor(config: T) {
            super(config);

            let me = this,
                $ctrl: any;


            if (me.config.handler) {
                let id:string = Frame.Utils.newGuid();
                $ctrl = $(me.config.handler);
                $ctrl.attr('id', id);
    
                me.config.id = id;
            } else {
                if (!me.config.id) {
                    me.config.id = Frame.Utils.newGuid();
                }
            }
    
            me.config.controls = [];
    
            if (me.config.store && me.config.store.length > 0) {
                me.dataBind();
            }
    
            if (me.config.hidden) {
                me.hide();
            }
        }
        /**
        * @public virtual methods
        */
        getJQuery(id?:string) {
            var me = this;

            if (id) {
                return $('#' + id);
            }

            if (me.config.parentControl) {
                return $('#' + me.config.parentControl.id + ' #' + me.config.id);
            }

            return $('#' + me.config.id);
        }
        dataBind() {

        }
        findControl(controlId:string) {
            var me = this,
                controls = me.config.controls,
                currControl;

            if (controls) {
                for (var i = 0; i < controls.length; i++) {
                    currControl = controls[i];

                    if (currControl.id.toLowerCase() === controlId.toLowerCase()) {
                        return currControl;
                    }
                }
            }

            return null;
        }
        addControl(controls:any) {
            var me = this;

            if (controls && controls.length > 0) {
                for (var i = 0; i < controls.length; i++) {
                    var currControl:any = controls[i];

                    currControl.parentControl = me;
                    me.config.controls.push(currControl);
                }
            }
        }
        removeControl(controlId:string) {
            var me = this,
                controls = me.config.controls,
                currControl;

            if (controls) {
                for (var i = 0; i < controls.length; i++) {
                    currControl = controls[i];

                    if (currControl.id.toLowerCase() === controlId.toLowerCase()) {
                        me.config.controls.splice(i, 1);
                        return currControl;
                    }
                }
            }
        }
        getValue() {
            return this.config.value;
        }
        setValue(value:any) {
            this.config.value = value;

            this.fireEvent('change');
        }
        disable() {
            var me = this;

            me.config.disabled = true;
        }
        enable() {
            var me = this;

            me.config.disabled = false;
        }
        hide() {
            var me = this,
                $ctrl = me.getJQuery(),
                panel = $ctrl.closest('.e-panel')[0];

            if (panel) {
                $(panel).hide();
            } else {
                $ctrl.hide();
            }

            me.config.hidden = true;
        }
        show() {
            var me = this,
                $ctrl = me.getJQuery(),
                panel = $ctrl.closest('.e-panel')[0];

            if (panel) {
                $(panel).show();
            } else {
                $ctrl.show();
            }

            me.config.hidden = false;
        }
        focus() {
            var me = this,
                $ctrl = me.getJQuery();

            $ctrl.focus();
        }    
    }
}
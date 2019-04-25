namespace Frame.Controls.Base {

    export interface IFormBaseConfig extends Frame.Controls.IControlConfig {
        isAjax?: boolean;
        validateHiddenFields?: boolean;
        validateConfig?: any;
        validator?: any;
        detectChange?: boolean;
        errorContainer?: any;
    }

    export class FormBase<T extends IFormBaseConfig> extends Frame.Controls.Control<T> {

        /**
        * @private properties
        */
        _lastValue?: any = null;

        /**
        * @constructor
        */
        constructor(config: T) {
            super(config);

            var me = this,
                $ctrl;

            //me.applyConfig(attrs);

            me.onLoad();

            $ctrl = me.getJQuery();

            $ctrl.bind('submit', me, me._onSubmit);

            me.config.validateConfig = {
                debug: true,
                errorElement: 'b',
                errorPlacement: me.config.errorContainer ? function (error: any, element: any) { } : function (error: any, element: any) {
                    if ($(element).prev('label')[0]) {
                        $(element).prev('label').append(error);
                    } else {
                        error.insertAfter(element);
                    }
                }
            };

            if (me.config.validateHiddenFields) {
                me.config.validateConfig.ignore = [];
            }

            me.config.validator = $ctrl.validate(me.config.validateConfig);

            if (me.config.errorContainer) {
                var $container = $('#' + me.config.errorContainer);
                $container.find('button').on('click', function () {
                    $container.slideUp();
                })
            }

            me.onLoaded();
        }

        onLoad(): void {
            var me = this;

            if (me.config.detectChange) {
                me._lastValue = me.getValue();
            }

            me.fireEvent('load');
        }

        onLoaded(): void {
            var me: FormBase<T> = this;

            if (me.config.detectChange) {
                me._lastValue = me.getValue();
            }

            me.fireEvent('loaded');
        }

        /**
        * @public virtual methods
        */

        showLoading(): void {
            var me = this,
                $ctrl = me.getJQuery();

            $('<div class="form-loading"></div>').css({
                position: "fixed",
                width: "100%",
                height: "100%",
                left: 0,
                top: 0,
                zIndex: 1000000,  // to be on the safe side
                background: "url(/static/assets/images/reload2.gif) no-repeat 50% 50%"
            }).appendTo($ctrl.css("position", "relative"));
        }

        hideLoading(): void {
            var me = this,
                $ctrl = me.getJQuery();

            $ctrl.find('.form-loading').remove();
        }
        changed(): boolean {
            var me: FormBase<T> = this,
                lastValue = me._lastValue,
                currValue = me.getValue();

            if (JSON.stringify(lastValue) != JSON.stringify(currValue)) {
                return true;
            }

            return false;
        }
        getValue(): object {
            var me = this,
                result: any = {},
                controls = me.config.controls;

            for (var ctrl in controls) {
                var currCtrl: any = controls[ctrl];

                if (!currCtrl.hidden) {
                    result[currCtrl.id] = currCtrl.getValue();
                }
            }

            return result;
        }

        setValue(model: any): void {
            var me = this,
                currValue: any,
                ctrl: any;

            for (var propName in model) {
                currValue = model[propName];

                if (currValue !== null && typeof currValue === 'object') {
                    var ctrl = me.findControl(propName);

                    if (ctrl) {
                        ctrl._fireChange = false;

                        ctrl.setValue(currValue);

                        ctrl._fireChange = true;
                    } else {
                        me.setValue(currValue);
                    }
                } else {
                    me._setControlValue(propName, currValue);
                }
            }

            me._lastValue = me.getValue();
        }

        clearValues(): void {
            var me = this;

            for (var key in me.config.controls) {
                me.config.controls[key].setValue();
            }
        }

        validate() {
            var me = this,
                $ctrl = me.getJQuery(),
                isValid = $ctrl.valid();
            //@ts-ignore
            if (me.onError) {
                //@ts-ignore
                me.onError(me.validator.errorList);
            }

            if (me.config.errorContainer) {
                var $container = $('#' + me.config.errorContainer);

                me._setErrorContainer($container, me.config.validator.errorList);
            }

            return isValid;
        }

        destroy() {
        }

        disable() {
            var me = this,
                $ctrl = me.getJQuery();

            //me.callBase(arguments);
            $ctrl.hide();
        }

        enable() {
            var me = this,
                $ctrl = me.getJQuery();

            //me.callBase(arguments);
        }

        /**
        * @private methods
        */
        private _setErrorContainer($container: any, errorList: []) {
            var me = this,
                $ctrl = me.getJQuery(),
                $formErrors = $container,
                $ul = $formErrors.find('ul');

            $ctrl.find('label').removeClass('danger');

            if (errorList.length > 0) {
                $ul.empty();

                var errorsByMethod:any;

                for (var i = 0; i < errorList.length; i++) {
                    var currError: any = errorList[i],
                        method: any = currError.method;

                    if (!errorsByMethod[method])
                        errorsByMethod[method] = [];

                    errorsByMethod[method].push(currError);
                }

                for (var methodItem in errorsByMethod) {
                    var errors = errorsByMethod[method],
                        methodErrorStr = '',
                        fieldsStr = [],
                        errorsLength = errors.length;

                    switch (methodItem) {
                        case 'required':
                            methodErrorStr = (errorsLength > 1 ? '<li>Os campos {0} são obrigatórios</li>' : '<li>O campo {0} é obrigatório</li>')

                            if (errorsLength > 1) {
                                var fields = '';

                                for (var i = 0; i < errorsLength; i++) {
                                    var $label = $(errors[i].element).prev();
                                    var text = $label.text();

                                    $label.addClass('danger');

                                    if (i == 0) {
                                        fields = text;
                                    } else if (i == errorsLength - 1) {
                                        fields += ' e ' + text;
                                    } else {
                                        fields += ', ' + text;
                                    }
                                }

                                fieldsStr.push(fields);
                            } else {
                                fieldsStr.push($(errors[0].element).prev().addClass('danger').text());
                            }

                            break;
                        case 'email':
                            methodErrorStr = '<li>Digite um e-mail válido</li>';
                            fieldsStr.push($(errors[0].element).prev().addClass('danger').text());

                            break;
                        default:
                            break;
                    }

                    $ul.append(Frame.Utils.format(methodErrorStr, fieldsStr));
                }

                if (fieldsStr && fieldsStr.length > 0) {
                    $formErrors.slideDown();
                }
            } else {
                $formErrors.slideUp();
            }
        }
       private _setControlValue(propName: string, propValue: string) {
            var me = this,
                ctrl = me.findControl(propName);

            if (ctrl) {
                ctrl._fireChange = false;

                ctrl.setValue(propValue);

                ctrl._fireChange = true;
            }
        }

       private _onSubmit(e: any) {
            var control = e.data;

            if (control.onBeforeRequest && !control.onBeforeRequest()) {
                e.preventDefault();
            } else {
                if (control.validate()) {
                    if (control.isAjax) {
                        e.preventDefault();
                        control.fireEvent('save');
                        control._lastValue = control.getValue();
                    } else {
                        control.getJQuery()[0].submit();
                    }
                } else {
                    e.preventDefault()
                }
            }

        }
    }
}
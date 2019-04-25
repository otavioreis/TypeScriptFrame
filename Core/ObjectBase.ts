namespace Core {
    export class ObjectBase {
        constructor(attrs: any) {
            for (let key in attrs) {
                (<any>this)[key] = attrs[key];
            }
        }
    }
}
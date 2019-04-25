namespace Frame.Remote.Command {
    export interface IProxy {
        processCommand(httpMethod: any, commandUrl: string, bodyParams?: any, isFormData?: any, timeout?: any, textTypeResponse?: any): Promise<any>;
    }
}
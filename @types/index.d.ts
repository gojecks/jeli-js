/**
 * jeli core
 */
export declare function jeli(name:String, options?:{
    exports?:Array<String>;
    requiredModules?:Array<String>;
    delimiter?:Array<String>;
}):IJModule;

export interface IJModule {
    directive(deifinition:IJELementDefinition, controller:Function): this;
    element(deifinition:IJELementDefinition, controller:Function): this;
    service(name:String, provider:class):this;
    provider(name:String, provider:class):this;
    config(config:Function):this;
    value(name:any, provider?:any):this;
}

export interface IJELementDefinition {
    selector: String;
    template?:String;
    templateUrl?: String;
    style?: String;
    styleUrl?:String;
    props?:Array<{name:String; value:String}>;
    DI?:Array<String>
}
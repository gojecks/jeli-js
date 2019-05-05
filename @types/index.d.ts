/**
 * jeli core
 */
export = jeli;
export as namespace jeli;

declare function jeli(name:String, options?:{
    exports?:Array<String>;
    requiredModules?:Array<String>;
    delimiter?:Array<String>;
}):jeli.IJModule;

declare namespace jeli {
    interface IJModule {
        directive(deifinition:IJElementDefinition, controller:Function): this;
        element(deifinition:IJElementDefinition, controller:Function): this;
        service(name:String, provider:Function):this;
        provider(name:String, provider:Function):this;
        config(config:Function):this;
        value(name:any, provider?:any):this;
    }
    
    interface IJElementDefinition {
        selector: String;
        template?:String;
        templateUrl?: String;
        style?: String;
        styleUrl?:String;
        props?:Array<{name:String; value:String}>;
        DI?:Array<String>
    }
}
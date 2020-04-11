//j-View Directive Fn
//As an Elemen <j-view ref="default"></j-view>
//as Attribute <element j-view="default"></element>
Element({
    selector: 'j-view',
    DI: ['jViewHandler', '$webState', 'ElementRef?'],
    props: ["ref"]
})

export function jViewFn(jViewHandler, $webState, elementRef) {
    this.didInit = function() {
        var ref = '@' + this.ref;
        //viewSetter for reference
        jViewHandler
            .setViewReference(elementRef, ref);
        $webState
            .events.$broadcast('view.render', ref);
    };
}
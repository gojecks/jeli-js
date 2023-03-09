//j-View Directive Fn
//As an Elemen <j-view ref="default"></j-view>
//as Attribute <element j-view="default"></element>
import { ViewHandler } from '../services/jWebViewHandler.service';
import { staticRoutePrefix } from '../services/utils';

Element({
    selector: 'router-view',
    DI: [ViewHandler, 'ElementRef?'],
    props: ["ref"]
})

export function jViewFn(viewHandler, elementRef) {
    this.ref = staticRoutePrefix;
    this.didInit = function() {
        //viewSetter for reference
        viewHandler.setViewReference(elementRef, this.ref);
    }

    this.viewDidDestroy = function() {
        viewHandler.destroy(this.ref)
    }
}
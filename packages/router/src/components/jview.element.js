//j-View Directive Fn
//As an Elemen <j-view ref="default"></j-view>
//as Attribute <element j-view="default"></element>
import { ViewHandler } from '../services/jWebViewHandler.service';
import { staticRoutePrefix } from '../services/utils';
import { LocationService } from '../services/route.location.service';
Element({
    selector: 'router-view',
    DI: [ViewHandler, LocationService, 'ElementRef?'],
    props: ["ref"]
})

export function jViewFn(viewHandler, locationService, elementRef) {
    this.ref = staticRoutePrefix;
    this.didInit = function() {
        //viewSetter for reference
        viewHandler
            .setViewReference(elementRef, this.ref);
        locationService
            .events.dispatch('view.render', this.ref);
    };

    this.viewDidDestroy = function() {
        viewHandler.destroy(this.ref)
    }
}
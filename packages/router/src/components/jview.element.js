//j-View Directive Fn
//As an Elemen <j-view ref="default"></j-view>
//as Attribute <element j-view="default"></element>
import { ViewHandler } from '../services/jWebViewHandler.service';
import { WebStateService } from '../services/jwebstate.service';
Element({
    selector: 'j-view',
    DI: [ViewHandler, WebStateService, 'ElementRef?'],
    props: ["ref"]
})

export function jViewFn(viewHandler, webStateService, elementRef) {
    this.didInit = function() {
        this._ref = '@' + this.ref;
        //viewSetter for reference
        viewHandler
            .setViewReference(elementRef, this._ref);
        webStateService
            .events.dispatch('view.render', this._ref);
    };

    this.viewDidDestroy = function() {
        viewHandler.destroy(this._ref)
    }
}
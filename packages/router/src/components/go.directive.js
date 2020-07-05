import { WebStateService } from '../services/jwebstate.service';
Directive({
    selector: 'go',
    DI: [WebStateService, 'ElementRef?'],
    props: ['go', "params"],
    events: ['event:click=clickHandler()']
})

/**
 * 
 * @param {*} webStateService 
 * @param {*} ElementRef 
 */
export function GoFn(webStateService, elementRef) {
    this.params = {};
    this.clickHandler = function() {
        // state has changed
        //where attr contains a parameter
        if (this.splitWhere.length) {
            //convert the required string to OBJECT
            this.params = elementRef.context.evaluate(this.splitWhere.join(':'));
        }

        webStateService.go(this.pathName, this.params);
    };

    Object.defineProperty(this, 'go', {
        set: function(value) {
            this.splitWhere = (value || '').split(':');
            this.pathName = this.splitWhere.shift();
        }
    });
}
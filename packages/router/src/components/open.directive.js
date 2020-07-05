import { ViewIntentService } from '../services/intent.service';
Directive({
    selector: 'open',
    DI: ['ElementRef?', ViewIntentService],
    props: ['open', "params"],
    events: ['event:click=clickHandler()']
})

/**
 * 
 * @param {*} ElementRef 
 * @param {*} viewIntent 
 */
export function OpenIntent(elementRef, viewIntent) {
    this.params = {};

    this.clickHandler = function() {
        // state has changed
        //where attr contains a parameter
        if (this.splitWhere.length) {
            //convert the required string to OBJECT
            this.params = elementRef.context.evaluate(this.splitWhere.join(':'));
        }
        viewIntent.openIntent(this.pathName, this.params);
    };

    Object.defineProperty(this, 'open', {
        set: function(value) {
            this.splitWhere = (value || '').split(':');
            this.pathName = this.splitWhere.shift();
        }
    });
}
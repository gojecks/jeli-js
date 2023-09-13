import { ViewIntentService } from '../services/intent.service';
Directive({
    selector: 'openIntent',
    DI: [ViewIntentService],
    props: ['open=openIntent', "params"],
    events: ['click:event=clickHandler()']
})

/**
 * 
 * @param {*} viewIntent 
 */
export function OpenIntent( viewIntent) {
    this.params = {};
    this.open = null;

    this.clickHandler = function() {
        viewIntent.openIntent(this.open, this.params);
    };
}
import { ViewIntentService } from '../services/intent.service';
Element({
    selector: 'router-intent-container',
    DI: [ViewIntentService, 'ElementRef?'],
    style: '.view-intent {position: fixed;top: 0; width: 100vw; height:100%; z-index: 1031; transition: all .1s ease 0s;\
        transform: translateX(-105%); display: block; background: #fff; overflow-y:auto}'
})
/**
 *
 * @param {*} viewIntent
 * @param {*} ElementRef
 */
export class JIntentContainer {
    constructor(viewIntent, ElementRef) {
        viewIntent.intentContainer = ElementRef;
        this.viewDidDestroy = function () {
            viewIntent.destroyAllIntent();
        };
    }
}
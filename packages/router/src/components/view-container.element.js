import { ViewIntentService } from '../services/intent.service';
Element({
    selector: 'router-intent-container',
    DI: [ViewIntentService, 'ElementRef?'],
    style: '.view-intent {position: fixed;top: 0; width: 100vw; min-height:100vh; z-index: 1031; transition: all .5s ease 0s;\
        transform: translateX(-105%); display: block; background: #fff}'
})

/**
 * 
 * @param {*} viewIntent 
 * @param {*} ElementRef 
 */
export function JIntentContainer(viewIntent, ElementRef) {
    viewIntent.intentContainer = ElementRef;
    this.viewDidDestroy = function() {
        viewIntent.destroyAllIntent();
    };
}
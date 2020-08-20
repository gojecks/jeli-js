import { WebStateService } from '../services/jwebstate.service';
Directive({
    selector: 'go',
    DI: [WebStateService],
    props: ['pathName=go', "params"],
    events: ['click:event=clickHandler()']
})

/**
 * 
 * @param {*} webStateService 
 */
export function GoFn(webStateService) {
    this.params = {};
    this.clickHandler = function() {
        webStateService.go(this.pathName, this.params);
    };
}
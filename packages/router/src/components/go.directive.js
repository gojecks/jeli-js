import { WebStateService } from '../services/jwebstate.service';
Directive({
    selector: 'go',
    DI: [WebStateService],
    props: ['pathName=go', "params", "target"],
    events: ['click:event=clickHandler($event)']
})

/**
 *
 * @param {*} webStateService
 */
export class GoFn {
    constructor(webStateService) {
        this.params = {};
        this.clickHandler = function (event) {
            event.preventDefault();
            webStateService.go(this.pathName, this.params, this.target);
        };
    }
}
import { staticInjectionToken } from "./injectors";

/**
 * 
 * @param {*} componentInstance 
 * @param {*} elementRef 
 * @param {*} viewChild 
 */
function buildViewChild(componentInstance, elementRef, viewChild) {
    elementRef.viewQuery.forEach(assignValue);
    /**
     * 
     * @param {*} item 
     */
    function assignValue(viewElement, property) {
        var option = viewChild[property];
        switch (option.type) {
            case (staticInjectionToken.QueryList):
                if (!componentInstance.hasOwnProperty(property)) {
                    componentInstance[property] = new QueryList();
                }
                componentInstance[property].add(viewElement);
                break;
            case (staticInjectionToken.ElementRef):
                componentInstance[property] = viewElement;
                break;
            default:
                componentInstance[property] = (viewElement.nodes.has(option.type) ? viewElement.nodes.get(option.type) : viewElement.context);
                break;
        }
    }

    elementRef.viewQuery.clear();
}
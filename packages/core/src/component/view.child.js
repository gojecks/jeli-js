/**
 * 
 * @param {*} componentInstance 
 * @param {*} elementRef 
 * @param {*} viewChild 
 */
function buildViewChild(componentInstance, elementRef, viewChild) {
    elementRef.viewQuery.render(assignValue);
    /**
     * 
     * @param {*} item 
     */
    function assignValue(item) {
        var option = viewChild[item.key];
        if (option.type) {
            switch (option.type.toLowerCase()) {
                case ('querylist'):
                    if (!componentInstance.hasOwnProperty(option.name)) {
                        componentInstance[option.name] = new QueryList();
                    }
                    componentInstance[option.name].add(item.value);
                    break;
                case ('jmodel'):
                    componentInstance[option.name] = item.value.nodes.get(option.value);
                    break;
                case ('elementref'):
                    componentInstance[option.name] = item.value;
                    break;
            }
        } else if (option.isdir) {
            componentInstance[option.name] = item.value.nodes.get(option.value);
        } else {
            componentInstance[option.name] = item.value.componentInstance;
        }
    }
}
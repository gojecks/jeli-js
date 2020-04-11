Directive({
    selector: 'go',
    DI: ['$webState', 'ElementRef?'],
    props: ['go', "params"],
    registry: ['event:click=clickHandler()']
})

/**
 * 
 * @param {*} $webState 
 * @param {*} ElementRef 
 */
export function GoFn($webState, elementRef) {
    this.params = {};
    this.clickHandler = function() {
        // state has changed
        //where attr contains a parameter
        if (this.splitWhere.length) {
            //convert the required string to OBJECT
            this.params = elementRef.context.evaluate(this.splitWhere.join(':'));
        }

        $webState.go(this.pathName, this.params);
    };

    Object.defineProperty(this, 'go', {
        set: function(value) {
            this.splitWhere = (value || '').split(':');
            this.pathName = this.splitWhere.shift();
        }
    });
}
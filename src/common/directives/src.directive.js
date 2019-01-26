commonModule
    .directive({
        selector: ':src',
        priority: 10,
        DI: ['ElementRef', 'Observables'],
        props: [{
            name: 'binding',
            value: ':src'
        }]
    }, SrcDirective);

function SrcDirective(elementRef, Observables) {
    var imgTypes = ['png', 'jpeg', 'jpg', 'bmp', 'gif', 'svg'];
    this.binding = '';
    this.didInit = function() {
        if (!$isEqual('IMG', elementRef.nativeElement.tagName)) {
            errorBuilder("jSrc directive can only be used on IMG element");
        }

        if (!validateImage(this.binding)) {
            Observables
                .observeForKey(this.binding, process);
        } else {
            process(this.binding, true);
        }
    };

    function process(value, isProcessed) {
        if (value && (isProcessed || validateImage(value))) {
            elementRef.setAttribute('src', value, true);
        }
    }

    function validateImage(imgPath) {
        var lastDotIndex = imgPath.lastIndexOf('.');
        return lastDotIndex && $inArray(imgPath.slice(lastDotIndex + 1), imgTypes);
    }
}
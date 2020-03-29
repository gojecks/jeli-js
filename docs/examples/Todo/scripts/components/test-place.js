Element({
    selector: "test-place",
    template: "<j-place></j-place>",
    DI: ['ElementRef?']
}, TestPlaceElement);

function TestPlaceElement(elementRef) {}
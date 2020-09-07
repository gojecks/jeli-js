Element({
    selector: "test-place",
    props: ["options"],
    template: "<div><j-place selector='[modal-body]'></j-place></div><div *for='opt in options'  {:jClass}='opt.class'><p>${opt | json}</p></div>"
})
export function TestPlaceElement() {
    this.test = false;
    this.html = '';
}
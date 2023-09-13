Pipe({
    name: 'sizeToUnit'
})
export function SizeToUnitPipe(){
    this.compile = function(size){
        var t = Math.floor(Math.log(size, 1024));
        var unit = ['b', 'kb', 'mb', 'gb', 'tb', 'pb'];
        return Math.round(size / Math.pow(1024, t), 2) + ' ' + unit[t];
    }
}
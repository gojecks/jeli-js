Pipe({
    name: 'dateTime',
    DI: ['dateTimeFactory']
})

export function dateTimeFilterFN(dateTimeFactory) {
    this.compile = function(text, replacer) {
        return dateTimeFactory.format(dateTimeFactory.$dateTime(text))(replacer);
    };
}
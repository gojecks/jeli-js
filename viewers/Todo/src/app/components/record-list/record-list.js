Element({
    selector: 'record-list',
    templateUrl: './record-list.html'
})
export class RecordListElement {
    constructor() {
        this.records = [
            { id: 1, name: 'Alpha' },
            { id: 2, name: 'Bravo' },
            { id: 3, name: 'Charlie' }
        ];
    }

    addRecord() {
        const id = this.records.length ? this.records[this.records.length - 1].id + 1 : 1;
        this.records.push({ id, name: 'Record ' + id });
    }

    clearRecords() {
        this.records = [];
    }
}

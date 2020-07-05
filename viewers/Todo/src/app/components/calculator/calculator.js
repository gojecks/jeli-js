Element({
    selector: 'app-calculator',
    templateUrl: './calculator.html',
    styleUrl: './calculator.css'
})
export function CalculatorComponent() {
    this.clear();
}

CalculatorComponent.prototype.getNumber = function(v) {
    console.log(v);
    if (this.waitForSecondNumber) {
        this.currentNumber = v;
        this.waitForSecondNumber = false;
    } else {
        this.currentNumber === '0' ? this.currentNumber = v : this.currentNumber += v;

    }
}

CalculatorComponent.prototype.getDecimal = function() {
    if (!this.currentNumber.includes('.')) {
        this.currentNumber += '.';
    }
}

CalculatorComponent.prototype.doCalculation = function(op, secondOp) {
    switch (op) {
        case '+':
            return this.firstOperand += secondOp;
        case '-':
            return this.firstOperand -= secondOp;
        case '*':
            return this.firstOperand *= secondOp;
        case '/':
            return this.firstOperand /= secondOp;
        case '=':
            return secondOp;
    }
}

CalculatorComponent.prototype.getOperation = function(op) {
    if (this.firstOperand === null) {
        this.firstOperand = Number(this.currentNumber);

    } else if (this.operator) {
        const result = this.doCalculation(this.operator, Number(this.currentNumber))
        this.currentNumber = String(result);
        this.firstOperand = result;
    }
    this.operator = op;
    this.waitForSecondNumber = true;

}


CalculatorComponent.prototype.clear = function() {
    this.currentNumber = '0';
    this.firstOperand = null;
    this.operator = null;
    this.waitForSecondNumber = false;
}
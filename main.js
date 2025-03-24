class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear();
  }

  clear() {
    this.currentOperand = "0";
    this.previousOperand = "";
    this.operation = undefined;
    this.shouldResetScreen = false;
  }

  delete() {
    if (this.currentOperand === "0") return;
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
    if (this.currentOperand === "") {
      this.currentOperand = "0";
    }
  }

  appendNumber(number) {
    if (this.shouldResetScreen) {
      this.currentOperand = "0";
      this.shouldResetScreen = false;
    }

    if (number === "." && this.currentOperand.includes(".")) return;
    if (this.currentOperand === "0" && number !== ".") {
      this.currentOperand = number.toString();
    } else {
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
  }

  chooseOperation(operation) {
    if (this.currentOperand === "0" && this.previousOperand === "") return;

    if (this.previousOperand !== "") {
      this.compute();
    }

    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.shouldResetScreen = true;
  }

  compute() {
    let computation;
    const prev = Number.parseFloat(this.previousOperand);
    const current = Number.parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "×":
        computation = prev * current;
        break;
      case "÷":
        if (current === 0) {
          this.currentOperand = "Error";
          this.previousOperand = "";
          this.operation = undefined;
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    this.currentOperand = this.roundResult(computation).toString();
    this.operation = undefined;
    this.previousOperand = "";
    this.shouldResetScreen = true;
  }

  roundResult(number) {
    // Round to 8 decimal places to avoid floating point issues
    return Math.round(number * 100000000) / 100000000;
  }

  getDisplayNumber(number) {
    if (number === "Error") return "Error";

    const stringNumber = number.toString();
    const integerDigits = Number.parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];

    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }

    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText = this.getDisplayNumber(
      this.currentOperand
    );
    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.getDisplayNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = "";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const previousOperandTextElement =
    document.getElementById("previous-operand");
  const currentOperandTextElement = document.getElementById("current-operand");
  const numberButtons = document.querySelectorAll("[data-number]");
  const operationButtons = document.querySelectorAll("[data-operation]");
  const equalsButton = document.querySelector("[data-equals]");
  const deleteButton = document.querySelector("[data-delete]");
  const allClearButton = document.querySelector("[data-all-clear]");

  const calculator = new Calculator(
    previousOperandTextElement,
    currentOperandTextElement
  );

  numberButtons.forEach((button) => {
    button.addEventListener("click", () => {
      calculator.appendNumber(button.innerText);
      calculator.updateDisplay();
    });
  });

  operationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      calculator.chooseOperation(button.innerText);
      calculator.updateDisplay();
    });
  });

  equalsButton.addEventListener("click", () => {
    calculator.compute();
    calculator.updateDisplay();
  });

  allClearButton.addEventListener("click", () => {
    calculator.clear();
    calculator.updateDisplay();
  });

  deleteButton.addEventListener("click", () => {
    calculator.delete();
    calculator.updateDisplay();
  });

  // Add keyboard support
  document.addEventListener("keydown", (event) => {
    if (/[0-9]/.test(event.key)) {
      calculator.appendNumber(event.key);
      calculator.updateDisplay();
    } else if (event.key === ".") {
      calculator.appendNumber(event.key);
      calculator.updateDisplay();
    } else if (event.key === "+" || event.key === "-") {
      calculator.chooseOperation(event.key);
      calculator.updateDisplay();
    } else if (event.key === "*") {
      calculator.chooseOperation("×");
      calculator.updateDisplay();
    } else if (event.key === "/") {
      calculator.chooseOperation("÷");
      calculator.updateDisplay();
    } else if (event.key === "Enter" || event.key === "=") {
      event.preventDefault();
      calculator.compute();
      calculator.updateDisplay();
    } else if (event.key === "Backspace") {
      calculator.delete();
      calculator.updateDisplay();
    } else if (event.key === "Escape") {
      calculator.clear();
      calculator.updateDisplay();
    }
  });
});

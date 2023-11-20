const calculator = document.querySelector('.calculator');
const history = document.querySelector('.history');
const display = document.querySelector('.result');
const clearBtn = document.querySelector('.clear');
const operatorBtns = document.querySelectorAll('.operator');

const calc = {
  history: [],
  results: [],
};
let isEqualPressed = false;
let isOperatorActive = false;
let secondOperandOnHold;

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;
const operate = function (operator, firstOperand, secondOperand) {
  const numberFormat = new Intl.NumberFormat('en-us');
  switch (operator) {
    case '+':
      return numberFormat.format(add(firstOperand, secondOperand));
    case '-':
      return numberFormat.format(subtract(firstOperand, secondOperand));
    case 'x':
      return numberFormat.format(multiply(firstOperand, secondOperand));
    case '÷':
      return operator === '÷' && secondOperand === 0
        ? 'ERROR'
        : numberFormat.format(divide(firstOperand, secondOperand));
    default:
      return 'Please use a valid operator';
  }
};

const isFloat = n => Number(n) % 1 !== 0;

const clearHistory = function () {
  history.textContent = '';
  calc.history = [];
  calc.results = [];
};

const removeActiveOperator = function () {
  operatorBtns.forEach(element => element.classList.remove('active'));
};

const clearDisplay = function () {
  display.textContent = '0';
};

const reset = function (el) {
  clearHistory(el);
  removeActiveOperator();
  clearDisplay(el);
  isOperatorActive = false;
  isEqualPressed = false;
};

const insertPlusMinus = function (displayedNumber) {
  return displayedNumber === '0'
    ? '-0'
    : new Intl.NumberFormat('en-us').format(0 - displayedNumber);
};

const convertToPercent = function (displayedNumber) {
  if (displayedNumber === '0') return '0';
  if (displayedNumber === '-0') return '-0';
  return `${Number(displayedNumber) / 100}`;
};

const chainNumbers = function (displayedNumber, pressedNumber) {
  if (isOperatorActive) {
    removeActiveOperator();
    displayedNumber = '0';
    isOperatorActive = false;
  }
  if (displayedNumber === '0' && pressedNumber === '0') return '0';
  if (displayedNumber === '-0' && pressedNumber === '0') return '-0';
  if (displayedNumber === '0') return pressedNumber;
  if (displayedNumber === '-0') return `${0 - pressedNumber}`;
  return `${displayedNumber}${pressedNumber}`;
};

const removeFormat = function (displayedNumber) {
  if (displayedNumber.length < 5) return displayedNumber;
  return displayedNumber
    .split('')
    .filter(char => char !== ',')
    .join('');
};

calculator.addEventListener('click', e => {
  const target = e.target;

  if (!target.classList.contains('btn')) return;

  // WHEN PRESSED ON AC/C BUTTON
  if (target.classList.contains('clear')) {
    reset();
  }

  // WHEN PRESSED ON PLUS-MINUS BUTTON
  if (target.classList.contains('plus-minus')) {
    const displayedNumber = removeFormat(display.textContent);
    display.textContent = insertPlusMinus(displayedNumber);
  }

  // WHEN PRESSED ON PERCENT BUTTON
  if (target.classList.contains('percent')) {
    const displayedNumber = removeFormat(display.textContent);
    display.textContent = convertToPercent(displayedNumber);
  }

  // WHEN PRESSED ON NUMBER BUTTONS
  if (target.classList.contains('number')) {
    if (isEqualPressed || display.textContent === 'ERROR') reset();

    const pressedNumber = target.textContent;
    let displayedNumber = removeFormat(display.textContent);
    const result = chainNumbers(displayedNumber, pressedNumber);

    display.textContent = new Intl.NumberFormat('en-us').format(result);
  }

  // WHEN PRESSED ON PERIOD BUTTON
  if (target.classList.contains('period')) {
    if (isEqualPressed || display.textContent === 'ERROR') reset();
    const displayedNumber = Number(removeFormat(display.textContent));
    if (isFloat(displayedNumber)) return;
    display.textContent = `${new Intl.NumberFormat('en-us').format(
      displayedNumber
    )}.`;
  }

  // WHEN PRESSED ON OPERATOR BUTTONS
  if (target.classList.contains('operator')) {
    if (display.textContent === 'ERROR') reset();

    if (isOperatorActive) {
      removeActiveOperator();
      calc.history.splice(-1, 1, target.textContent);
      history.textContent = calc.history.join(' ');
      target.classList.add('active');
      return;
    }

    isOperatorActive = true;
    const len = calc.history.length;
    const pressedNumber = display.textContent;
    if (len && !isEqualPressed) {
      const operator = calc.history[len - 1];
      const firstOperand =
        len === 2
          ? Number(removeFormat(calc.history[0]))
          : calc.results[calc.results.length - 1];
      const secondOperand = Number(removeFormat(pressedNumber));

      display.textContent = operate(operator, firstOperand, secondOperand);
      calc.results.push(Number(removeFormat(display.textContent)));
    } else isEqualPressed = false;

    len % 2
      ? calc.history.push(target.textContent)
      : calc.history.push(pressedNumber, target.textContent);
    history.textContent = calc.history.join(' ');
    target.classList.add('active');
  }

  // WHEN PRESSED ON EQUAL BUTTON
  if (target.classList.contains('equal')) {
    if (isOperatorActive) reset();
    if (!calc.history.length) return;

    const len = calc.history.length;
    const operator = calc.history[isEqualPressed ? len - 2 : len - 1];
    const firstOperand = isEqualPressed
      ? Number(removeFormat(display.textContent))
      : len === 2
      ? Number(removeFormat(calc.history[0]))
      : calc.results[calc.results.length - 1];
    const secondOperand = isEqualPressed
      ? Number(removeFormat(calc.history[len - 1]))
      : Number(removeFormat(display.textContent));
    if (!isEqualPressed) secondOperandOnHold = display.textContent;

    display.textContent = operate(operator, firstOperand, secondOperand);
    calc.results.push(Number(removeFormat(display.textContent)));

    isEqualPressed
      ? calc.history.push(operator, secondOperandOnHold)
      : calc.history.push(secondOperandOnHold);
    history.textContent = calc.history.join(' ');
    isEqualPressed = true;
  }
});

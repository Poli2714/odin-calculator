'use strict';

const calculator = document.querySelector('.calculator');
const history = document.querySelector('.history');
const display = document.querySelector('.result');
const clearBtn = document.querySelector('.clear');
const operatorBtns = document.querySelectorAll('.operator');

let firstOperand = '';
let secondOperand = '';
let currentOperator = '';
// let storedData = '';
let operationsHistory = [];

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;
const convertToPercent = num => num / 100;
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
      return numberFormat.format(divide(firstOperand, secondOperand));
    default:
      return 'Please use a valid operator';
  }
};
const isFloat = n => Number(n) % 1 !== 0;
const formatToNumber = function (string) {
  return string
    .split('')
    .filter(char => char !== ',')
    .join('');
};

const renderNumbers = function (displayedNumber, pressedNumber) {
  if (displayedNumber === '0' && pressedNumber === '0') return '0';
  if (displayedNumber === '-0' && pressedNumber === '0') return '-0';
  if (displayedNumber === '0') return pressedNumber;
  if (displayedNumber === '-0') return `${0 - pressedNumber}`;
  return new Intl.NumberFormat('en-us').format(displayedNumber + pressedNumber);
};

const displayHistory = function (history, displayedNumber, operator) {
  history.push(displayedNumber, operator);
  return history.join(' ');
};
const clearDisplay = function (display) {};

calculator.addEventListener('click', function (e) {
  const target = e.target;
  if (!target.classList.contains('btn')) return;

  if (target.classList.contains('clear')) {
    display.textContent = '0';
    history.textContent = '';
    clearBtn.textContent = 'AC';
    firstOperand = secondOperand = currentOperator = storedData = '';
    operatorBtns.forEach(operator => operator.classList.remove('active'));
  }

  if (target.classList.contains('plus-minus')) {
    const displayedNumber = Number(display.textContent);
    storedData = !displayedNumber ? '-0' : 0 - displayedNumber;
    display.textContent = storedData;
  }

  if (target.classList.contains('percent')) {
    const displayedNumber = Number(display.textContent);
    display.textContent = convertToPercent(displayedNumber);
    storedData = '';
  }

  if (target.classList.contains('number')) {
    let userNumber = target.textContent;
    let displayedNumber = formatToNumber(display.textContent);
    if (currentOperator) {
      operatorBtns.forEach(operator => operator.classList.remove('active'));
      displayedNumber = '0';
      currentOperator = '';
    }
    display.textContent = renderNumbers(displayedNumber, userNumber);
    clearBtn.textContent = 'C';
  }

  if (target.classList.contains('period')) {
    const displayNumber = display.textContent;
    if (isFloat(displayNumber)) return;
    storedData = displayNumber === '0' ? '0.' : `${storedData}.`;
    display.textContent = storedData;
    clearBtn.textContent = 'C';
  }

  if (target.classList.contains('operator')) {
    let displayedNumber = display.textContent;
    if (currentOperator) {
      operatorBtns.forEach(operator => operator.classList.remove('active'));
      currentOperator = target.textContent;
      operationsHistory[operationsHistory.length - 1] = target.textContent;
      history.textContent = operationsHistory.join(' ');
    } else {
      currentOperator = target.textContent;
      history.textContent = displayHistory(
        operationsHistory,
        displayedNumber,
        currentOperator
      );

      const len = operationsHistory.length;
      if (firstOperand === '') {
        firstOperand = +formatToNumber(displayedNumber);
      } else {
        const previousOperator = operationsHistory[len - 3];
        secondOperand = +formatToNumber(displayedNumber);
        if (secondOperand === 0 && previousOperator === '÷') {
          display.textContent = 'Error';
          return;
        }
        display.textContent = operate(
          previousOperator,
          firstOperand,
          secondOperand
        );
        firstOperand = +formatToNumber(display.textContent);
      }
    }
    target.classList.add('active');
  }

  if (target.classList.contains('equal')) {
    secondOperand = formatToNumber(display.textContent);
    if (secondOperand === 0 && currentOperator === '÷') {
      display.textContent = 'ERROR';
      return;
    }
    display.textContent = operate(currentOperator, firstOperand, secondOperand);
    firstOperand = secondOperand = currentOperator = storedData = '';
  }
});

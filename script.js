'use strict';

const calculator = document.querySelector('.calculator');
const display = document.querySelector('.result');
const clearBtn = document.querySelector('.clear');
const operatorBtns = document.querySelectorAll('.operator');

let firstOperand = '';
let secondOperand = '';
let operator = '';
let storedData = '';

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
const formatToNumber = function (string) {
  return +string
    .split('')
    .filter(char => char !== ',')
    .join('');
};

calculator.addEventListener('click', function (e) {
  const target = e.target;
  if (!target.classList.contains('btn')) return;

  if (target.classList.contains('clear')) {
    display.textContent = '0';
    clearBtn.textContent = 'AC';
    firstOperand = secondOperand = operator = storedData = '';
    operatorBtns.forEach(operator => operator.classList.remove('active'));
  }

  if (target.classList.contains('plus-minus')) {
    storedData =
      display.textContent === '0' ? '-0' : 0 - Number(display.textContent);
    display.textContent = storedData;
  }

  if (target.classList.contains('number')) {
    let userNumber = target.textContent;
    if (
      (display.textContent === '0' || display.textContent === '-0') &&
      userNumber === '0'
    )
      return;
    if (display.textContent === '-0') storedData = '-';
    storedData += userNumber;
    display.textContent = new Intl.NumberFormat().format(storedData);
    operatorBtns.forEach(operator => operator.classList.remove('active'));
    clearBtn.textContent = 'C';
  }

  // Add floating point to numbers when press '.'

  if (target.classList.contains('operator')) {
    // Check if display.textcontent is of numeric value. It can display ERROR. Will not it later
    storedData = '';
    if (firstOperand === '') {
      firstOperand = formatToNumber(display.textContent);
    } else {
      secondOperand = formatToNumber(display.textContent);
      if (secondOperand === 0 && operator === '÷') {
        display.textContent = 'ERROR';
        return;
      }
      display.textContent = operate(operator, firstOperand, secondOperand);
      firstOperand = formatToNumber(display.textContent);
    }
    operator = target.textContent;
    target.classList.add('active');
  }

  if (target.classList.contains('equal')) {
    secondOperand = formatToNumber(display.textContent);
    if (secondOperand === 0 && operator === '÷') {
      display.textContent = 'ERROR';
      return;
    }
    display.textContent = operate(operator, firstOperand, secondOperand);
    firstOperand = secondOperand = operator = storedData = '';
  }

  if (target.classList.contains('percent')) {
    display.textContent = convertToPercent(+display.textContent);
    storedData = '';
  }
});

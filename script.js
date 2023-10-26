'use strict';

const calculator = document.querySelector('.calculator');
const result = document.querySelector('.result');

let firstNumber = 0;
let secondNumber = 2;
let operator = '+';
let firstNumDefined = false;

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;
const convertToPercent = num => num / 100;
const operate = function (operator, firstNum, secondNum) {
  switch (operator) {
    case '+':
      return add(firstNum, secondNum);
    case '-':
      return subtract(firstNum, secondNum);
    case '*':
      return multiply(firstNum, secondNum);
    case '/':
      return divide(firstNum, secondNum);
    default:
      return 'Please use a valid operator';
  }
};

const displayNumbers = function (textNum) {};

let displayNum = '';
const calcObj = {};

calculator.addEventListener('click', function (e) {
  const target = e.target;
  if (!target.classList.contains('btn')) return;

  if (target.classList.contains('number')) {
    if (result.textContent === '0' && target.textContent === '0') return;
    displayNum += target.textContent;
    result.textContent = displayNum;
  }

  if (target.classList.contains('clear')) {
    result.textContent = '0';
    displayNum = [];
  }

  if (target.classList.contains('operator')) {
    firstNumber = +result.textContent;
    operator = target.textContent;
    displayNum = '';
  }

  if (target.classList.contains('equal')) {
    secondNumber = +result.textContent;
    result.textContent = operate(operator, firstNumber, secondNumber);
  }
});

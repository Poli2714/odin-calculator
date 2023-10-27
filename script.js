'use strict';

const calculator = document.querySelector('.calculator');
const result = document.querySelector('.result');
const clearBtn = document.querySelector('.clear');
const operatorBtns = document.querySelectorAll('.operator');

let firstOperand = '';
let secondOperand = '';
let operator = '';

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;
const convertToPercent = num => num / 100;
const operate = function (operator, firstOperand, secondOperand) {
  switch (operator) {
    case '+':
      return add(firstOperand, secondOperand);
    case '-':
      return subtract(firstOperand, secondOperand);
    case 'x':
      return multiply(firstOperand, secondOperand);
    case '÷':
      return divide(firstOperand, secondOperand);
    default:
      return 'Please use a valid operator';
  }
};

let display = '';

calculator.addEventListener('click', function (e) {
  const target = e.target;
  if (!target.classList.contains('btn')) return;

  if (target.classList.contains('number')) {
    if (result.textContent === '0' && target.textContent === '0') return;
    display += target.textContent;
    result.textContent = display;
    clearBtn.textContent = 'C';
  }

  if (target.classList.contains('clear')) {
    result.textContent = '0';
    clearBtn.textContent = 'AC';
    display = '';
    firstOperand = secondOperand = operator = '';
  }

  if (target.classList.contains('operator')) {
    display = '';
    if (firstOperand === '') {
      firstOperand = +result.textContent;
    } else {
      secondOperand = +result.textContent;
      if (secondOperand === 0 && operator === '÷') {
        result.textContent = 'ERROR';
        return;
      }
      result.textContent = operate(operator, firstOperand, secondOperand);
      firstOperand = +result.textContent;
    }
    operator = target.textContent;
  }

  if (target.classList.contains('equal')) {
    secondOperand = +result.textContent;
    if (secondOperand === 0 && operator === '÷') {
      result.textContent = 'ERROR';
      return;
    }
    result.textContent = operate(operator, firstOperand, secondOperand);
    display = '';
    firstOperand = secondOperand = operator = '';
  }

  if (target.classList.contains('percent')) {
    result.textContent = convertToPercent(+result.textContent);
  }
});

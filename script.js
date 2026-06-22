let display = document.getElementById('display');

function appendNumber(num) {
    if (num === '.' && display.value.includes('.')) {
        return;
    }
    display.value += num;
}

function appendOperator(op) {
    const lastChar = display.value[display.value.length - 1];
    
    // Prevent multiple operators in a row
    if (lastChar === '+' || lastChar === '-' || lastChar === '*' || lastChar === '/' || lastChar === '%') {
        return;
    }
    
    // Prevent operator as first character
    if (display.value === '') {
        return;
    }
    
    display.value += op;
}

function deleteLastChar() {
    display.value = display.value.slice(0, -1);
}

function clearDisplay() {
    display.value = '';
}

function calculate() {
    try {
        // Replace the minus sign with proper subtraction operator
        let expression = display.value.replace(/−/g, '-');
        
        // Evaluate the expression
        let result = eval(expression);
        
        // Handle floating point precision
        display.value = Math.round(result * 100000000) / 100000000;
    } catch (error) {
        display.value = 'Error';
        setTimeout(() => {
            clearDisplay();
        }, 1500);
    }
}

// Allow keyboard input
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '.') {
        appendNumber('.');
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendOperator(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Backspace') {
        event.preventDefault();
        deleteLastChar();
    } else if (key === 'Escape') {
        clearDisplay();
    }
});
const inputDisplay = document.getElementById('input');
        const resultDisplay = document.getElementById('result');
        let currentInput = '';
        let lastCalculation = null;
        
        // Handle all button clicks with visual feedback
        function handleButtonClick(button, value) {
            // Add press animation
            button.classList.add('pressed');
            setTimeout(() => {
                button.classList.remove('pressed');
            }, 300);
            
            // Handle the button action
            switch(value) {
                case 'clear':
                    clearAll();
                    break;
                case 'backspace':
                    backspace();
                    break;
                case '=':
                    calculate();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    appendOperator(value);
                    break;
                default:
                    appendNumber(value);
            }
        }
        
        // Update the display with visual feedback
        function updateDisplay() {
            inputDisplay.textContent = currentInput || '0';
            
            try {
                if (currentInput === '') {
                    resultDisplay.textContent = '0';
                    resultDisplay.className = 'result';
                    return;
                }
                
                // Replace × with * for calculation
                const expression = currentInput.replace(/×/g, '*');
                const result = safeEval(expression);
                
                resultDisplay.textContent = formatNumber(result);
                resultDisplay.className = 'result success';
                lastCalculation = result;
            } catch (e) {
                resultDisplay.textContent = 'Error';
                resultDisplay.className = 'result error';
            }
        }
        
        // Safe evaluation function
        function safeEval(expression) {
            // Remove anything that's not digits, operators, or decimal points
            const sanitized = expression.replace(/[^\d+\-*/.%]/g, '');
            return new Function('return ' + sanitized)();
        }
        
        // Format number with comma separators
        function formatNumber(num) {
            return parseFloat(num).toLocaleString(undefined, {
                maximumFractionDigits: 8
            });
        }
        
        // Append a number to the current input
        function appendNumber(number) {
            // Prevent multiple decimal points in a number
            if (number === '.') {
                const parts = currentInput.split(/[\+\-\*\/%]/);
                if (parts[parts.length - 1].includes('.')) {
                    return;
                }
            }
            
            currentInput += number;
            updateDisplay();
        }
        
        // Append an operator to the current input
        function appendOperator(operator) {
            if (currentInput === '' && operator !== '-') {
                // If empty, allow minus for negative numbers
                if (operator === '-') {
                    currentInput += '-';
                }
                return;
            }
            
            // Replace the last operator if one exists
            const lastChar = currentInput.slice(-1);
            if (['+', '-', '×', '/', '%'].includes(lastChar)) {
                currentInput = currentInput.slice(0, -1);
            }
            
            // For display, show × instead of *
            const displayOperator = operator === '*' ? '×' : operator;
            currentInput += displayOperator;
            updateDisplay();
        }
        
        // Calculate the final result
        function calculate() {
            if (currentInput === '' && lastCalculation !== null) {
                currentInput = lastCalculation.toString();
                updateDisplay();
                return;
            }
            
            try {
                const expression = currentInput.replace(/×/g, '*');
                const result = safeEval(expression);
                currentInput = result.toString();
                updateDisplay();
            } catch (e) {
                resultDisplay.textContent = 'Error';
                resultDisplay.className = 'result error';
            }
        }
        
        // Clear all input
        function clearAll() {
            currentInput = '';
            lastCalculation = null;
            updateDisplay();
        }
        
        // Backspace - remove last character
        function backspace() {
            currentInput = currentInput.slice(0, -1);
            updateDisplay();
        }
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            const key = e.key;
            
            // Find and click the corresponding button
            let button = null;
            
            if (key >= '0' && key <= '9') {
                button = document.querySelector(`button:not(.operator):not(.clear):not(.equals):not([onclick*="backspace"])` + 
                         `[onclick*="${key}"]`);
            } else if (key === '.') {
                button = document.querySelector(`button[onclick*="'.'"]`);
            } else if (['+', '-', '*', '/', '%'].includes(key)) {
                button = document.querySelector(`button.operator[onclick*="${key}"]`);
            } else if (key === 'Enter' || key === '=') {
                button = document.querySelector('.equals');
            } else if (key === 'Escape') {
                button = document.querySelector('.clear');
            } else if (key === 'Backspace') {
                button = document.querySelector(`button[onclick*="backspace"]`);
            }
            
            if (button) {
                button.click();
                e.preventDefault();
            }
        });

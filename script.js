// Function to append values to the display
function appendValue(value) {
    document.getElementById("display").value += value;
}

// Function to clear the display
function clearDisplay() {
    document.getElementById("display").value = "";
}

// Function to delete the last character
function deleteLast() {
    let display = document.getElementById("display").value;
    document.getElementById("display").value = display.slice(0, -1);
}

// Function to convert degrees to radians
function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

// Function to evaluate the expression
function calculateResult() {
    try {
        let expression = document.getElementById("display").value;

        console.log("Original Expression:", expression); // Debugging

        // Ensure parentheses are balanced
        if (!isBalanced(expression)) {
            throw new Error("Unbalanced parentheses");
        }

        // Replace mathematical functions with JavaScript Math equivalents
        expression = expression
            .replace(/sin\(([^)]+)\)/g, (_, value) => `Math.sin(degToRad(${value}))`)
            .replace(/cos\(([^)]+)\)/g, (_, value) => `Math.cos(degToRad(${value}))`)
            .replace(/tan\(([^)]+)\)/g, (_, value) => `Math.tan(degToRad(${value}))`)
            .replace(/log\(([^)]+)\)/g, (_, value) => `Math.log10(${value})`)
            .replace(/ln\(([^)]+)\)/g, (_, value) => `Math.log(${value})`)
            .replace(/sqrt\(([^)]+)\)/g, (_, value) => `Math.sqrt(${value})`)
            .replace(/exp\(([^)]+)\)/g, (_, value) => `Math.exp(${value})`)
            .replace(/π/g, "Math.PI")
            .replace(/\be\b/g, "Math.E") // Fix for 'e' value
            .replace(/pow\(([^,]+),([^)]+)\)/g, (_, base, exponent) => `Math.pow(${base},${exponent})`) // Fix for pow()
            .replace(/(\d+)\^(\d+)/g, (_, base, exponent) => `Math.pow(${base},${exponent})`); // Support `^` notation

        console.log("Converted Expression:", expression); // Debugging

        // Evaluate the expression
        let result = new Function("degToRad", "Math", `return ${expression}`)(degToRad, Math);

        if (isNaN(result) || !isFinite(result)) {
            throw new Error("Invalid calculation");
        }

        // Save to history
        addToHistory(document.getElementById("display").value, result);

        document.getElementById("display").value = result;
    } catch (error) {
        console.error("Calculation Error:", error.message);
        document.getElementById("display").value = "Error";
    }
}

// Function to check if parentheses are balanced
function isBalanced(expression) {
    let stack = [];
    for (let char of expression) {
        if (char === "(") {
            stack.push(char);
        } else if (char === ")") {
            if (stack.length === 0) return false;
            stack.pop();
        }
    }
    return stack.length === 0;
}

// Function to add history
function addToHistory(expression, result) {
    let historyList = document.getElementById("history");
    let entry = document.createElement("li");
    entry.textContent = `${expression} = ${result}`;
    historyList.prepend(entry);
}

// Keypress event listener for keyboard input
document.addEventListener("keydown", function (event) {
    let key = event.key;
    if ("0123456789+-*/().,^".includes(key)) {  // ✅ Now supports `,`
        appendValue(key);
    } else if (key === "Enter") {
        calculateResult();
    } else if (key === "Backspace") {
        deleteLast();
    } else if (key === "Escape") {
        clearDisplay();
    }
});

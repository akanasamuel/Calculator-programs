let screen = document.getElementById("screen");

//---------DISPLAY WIRING
function displayWiring(){
  document.querySelectorAll(".display-keys").forEach(btn=>{
    btn.addEventListener("click",()=>{
      screen.value += btn.dataset.value;
    });
  });
  document.getElementById("clear").addEventListener("click",()=>{screen.value = ""});
  
  document.getElementById("del").addEventListener("click",()=>{
    screen.value = screen.value.slice(0,-1);
  });
  
};
//---------TAB SWITCHING
function inverseTabSwitching(){
  let currentTab = "main";
  document.querySelectorAll(".inv").forEach(btn=>{
    btn.addEventListener("click",()=>{
      if(currentTab == "main"){
        currentTab = "inv";
        document.getElementById("right-keys").style.display = "none";
        document.getElementById("inverse-keys").style.display = "grid";
        return;
      }
      else if(currentTab=="inv"){
        currentTab = "main";
        document.getElementById("inverse-keys").style.display = "none";
        document.getElementById("right-keys").style.display = "grid";
      }
    });
  });
};

//-----------Factorial function
function factorial(num){
  let fact = 1;
  for(let i=1;i<=num;i++){
    fact *= i;
  }
  return fact;
};


//----------Tokenizing the input
function tokenize(expression){
  let tokens = [];
  let i = 0;
  while(i < expression.length){
    let char = expression[i];
    
    if(/\d/.test(char)){
      let num = "";
      while(i < expression.length && /\d/.test(expression[i]) || expression[i] == "."){
        num += expression[i];
        i++;
      }
    tokens.push({type:"number" , value: parseFloat(num)});
    }
    
    if(/[a-zπ√\u221B]/.test(char)){
      let word = ""
      while(i < expression.length && /[a-zπ√\u221B]/.test(expression[i])){
        word += expression[i];
        i++;
      }
      const constants = {"π": Math.PI ,"e":Math.E};
      if(constants[word]){
        tokens.push({type:"number",value: constants[word]});
      }else{
        tokens.push({type:"function", value: word});
      }
    }
    
    if("%!".includes(char)){
      tokens.push({type:"postfix", value: char});
      i++;
    }
    
    if("+-×÷^()".includes(char)){
      let prev = tokens[tokens.length-1];
      if(!prev || prev.type === "operator" || prev.value === "("){
        tokens.push({type:"operator" ,value: char =="-" ? "neg" : "pos"})
      }  
      tokens.push({type: char === "(" || char === ")" ? "paren" : "operator"  , value: char });
      i++;
      continue;
    }
  }
  return tokens;
  
};

//------------Setting operator precedence
function operatorPrecedence(operator){
  switch(operator){
    case '+': return 1;
    case '-': return 1;
    case '×': return 2;
    case '÷': return 2;
    case '^': return 3;
    case 'neg': return 4;
    case 'pos': return 4;
  }
};

//-------------The shunting yard function
function shuntingYard(tokens){
  let output = [];
  let operatorStack = [];
  
for (let token of tokens) {
  if (token.type === "number" || token.type === "postfix") {
    output.push(token);
  } else if (token.type === "function") {
    operatorStack.push(token);
  } else if (token.type === "operator") {
      let op = token.value;
      
      while(operatorStack.length > 0 && operatorStack[operatorStack.length-1].type ==="operator" && (op == "^" ?
      operatorPrecedence(operatorStack[operatorStack.length-1].value) > operatorPrecedence(op) : operatorPrecedence(operatorStack[operatorStack.length-1].value) >= operatorPrecedence(op))){
        output.push(operatorStack.pop());
      }
      operatorStack.push(token);
    }else if(token.type == "paren"){
      if(token.value ==="(")operatorStack.push(token);
      
      else if(token.value===")"){
        while(operatorStack.length > 0 && operatorStack[operatorStack.length-1].value !=="("){
          output.push(operatorStack.pop());
        }
        operatorStack.pop();
        if(operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type === "function") {
          output.push(operatorStack.pop());
        }        
      }
    }
        
  }
  while(operatorStack.length > 0){
    output.push(operatorStack.pop());
  }
  return output;
  
};

//----------The actual calculation function
function evaluation(output){
  let stack = [];
  for(let token of output){
    if(token.type=="number"){
    stack.push(token.value);
    }else if(token.type=="operator"){
      let b = stack.pop();
      let a = stack.pop();
      
      switch(token.value){
        case '+': 
          stack.push(a+b);
          break;
        case '-':
          stack.push(a-b);
          break;
        case '×':
          stack.push(a*b);
          break;
        case '÷':
          if(b==0){
            screen.value = "Cannot devide by zero. Press Clear";
            continue;
          }
          stack.push(a/b);
          break;
        case '^':
          stack.push(Math.pow(a,b));
          break;
        case 'neg':
          stack.push(-a);
          break;
        case 'pos':
          stack.push(a);
          break;
        default:
          break;
      }
    }else if(token.type =="postfix"){
      let a = stack.pop();
      switch(token.value){
        case '!':
          stack.push(factorial(a));
          break;
        case '%':
          stack.push(a*(1/100));
          break;
        default:
          break;
      }
    }else if(token.type == "function"){
      let a = stack.pop();
      let adeg = a*(Math.PI/180);
      switch(token.value){
        case 'ln':
          stack.push(Math.log(a));
          break;
        case 'log':
          stack.push(Math.log10(a));
          break;
        case 'sin':
          stack.push(Math.sin(adeg));
          break;
        case 'cos':
          stack.push(Math.cos(adeg));
          break;
        case 'tan':
          stack.push(Math.tan(adeg));
          break;
        case '√':
          stack.push(Math.sqrt(a));
          break;
        case '\u221B':
          stack.push(Math.cbrt(a));
          break;
        default:
          break;
      }
    }
    
  }
  return stack;
};

//---------The function that unites all the other functions
function calculate(expression){
  const tokens = tokenize(expression);
  const output = shuntingYard(tokens);
  const result = evaluation(output);
  return result;
  
};

//-------------Equal button functionality
document.getElementById("equal").addEventListener("click",()=>{
  screen.value = calculate(screen.value);
})


displayWiring();
inverseTabSwitching();

//New features
//clear and DEL functionality
//Main Operations,factorial and percentage Calculation
//Constants
//The special operations

//changes
//Swaped the log and exponent
//removed duplicate css
//changed exponent symbol
//changed multiplication and division 

//Suggestions
//change colors of equal and del buttons
//change data values

const passwordDisplay = document.querySelector("[data-passwordDisplay]");

const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");


const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");

const uppercaseCheckBox = document.querySelector("#uppercase");
const lowercaseCheckBox = document.querySelector("#lowercase");
const numbersCheckBox = document.querySelector("#numbers");
const symbolsCheckBox = document.querySelector("#symbols");

const indicator = document.querySelector("[data-indicator]");

const generateBtn = document.querySelector("#generateBtn");

const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_-+={[}]:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

// set password length
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;

  const min = inputSlider.min;
  const max = inputSlider.max;
  
  inputSlider.style.backgroundSize = ( (passwordLength - min) *100/(max-min)) + "% 100%";

}

// handle input length slider
inputSlider.addEventListener('input', (e)=>{
  passwordLength = e.target.value;
  handleSlider();
})

// handle check count
allCheckBox.forEach( (checkbox) => {
  checkbox.addEventListener('change', handleCheckBoxChange);
});

function handleCheckBoxChange(){
  checkCount = 0;
  allCheckBox.forEach( (checkbox)=>{
    if(checkbox.checked)
      checkCount++;
  });

  // special condition
  if(passwordLength < checkCount){
    passwordLength = checkCount;
    handleSlider();
  }
}

// copy password
async function copyContent(){
  try{
    await  navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  }
  catch(error){
    copyMsg.innerText = "Failed";    
  } 
  
  // to make copy span visible
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");  
  }, 2000);
}

copyBtn.addEventListener('click',()=>{
  if(passwordDisplay.value){
    copyContent();
  }
})

// generate random values
function getRndInt(min,max){
  return Math.floor(Math.random() * (max-min)) + min;
}

function generateRndNumber(){
  return getRndInt(0,9);  
}

function generateLowerCase(){
  return String.fromCharCode(getRndInt(97,123));
} 

function generateUpperCase(){
  return String.fromCharCode(getRndInt(65,91));
}

function generateSymbols(){
  const randNum = getRndInt(0,symbols.length);
  return symbols.charAt(randNum);
}

// set indicator
function setIndicator(color){
  indicator.style.backgroundColor = color;
  (indicator.style.boxShadow = `0px 0px 12px 1px ${color}`);
}

// default indicator
setIndicator("#ccc");

// calculate strength 
function calcStrength(){
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if(uppercaseCheckBox.checked) hasUpper = true;
  if(lowercaseCheckBox.checked) hasLower = true;
  if(numbersCheckBox.checked) hasNum = true;
  if(symbolsCheckBox.checked) hasSym = true;

  if((passwordLength >= 8) && (hasLower && hasUpper) && (hasSym) && (hasNum)){
    setIndicator('#00ff00')
  }
  else if((passwordLength < 8) && (hasLower &&  hasUpper) && (hasSym) && (hasNum))
  {
    setIndicator("yellow");
  }
  else if((passwordLength >=8) && (hasUpper || hasLower) && (hasSym || hasNum) ){
    setIndicator("Orange");
  }

}

// Shuffle the array randomly - Fisher Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // find out random j
    const j = Math.floor(Math.random() * (i + 1));
    // swap 2 numbers
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  // str = array.join("");
  return str;
}

generateBtn.addEventListener('click', ()=>{
  // if zero checkbox selected
  if(checkCount <= 0){
    alert('Atleast check one checkbox');
    return;
  }
  // password len should be >= checkbox count
  if(passwordLength < checkCount){
    passwordLength = checkCount;
    handleSlider();
  }

  // remove the previous password
  password = "";

  // generating new password
  let funArr = [];
  
  if(uppercaseCheckBox.checked)
    funArr.push(generateUpperCase); 

  if(lowercaseCheckBox.checked)
    funArr.push(generateLowerCase);

  if(numbersCheckBox.checked)
    funArr.push(generateRndNumber);

  if(symbolsCheckBox.checked)
    funArr.push(generateSymbols);
  
  // cumpulsory addition    
  for(let i=0; i<funArr.length; i++)
    password+= funArr[i]();
 
  // remaining addition
  for(let i=0; i<passwordLength-funArr.length; i++){
    let randIndex = getRndInt(0, funArr.length);
    password += funArr[randIndex]();
  }
  
  // shuffle password
  password = shuffleArray(Array.from(password));
  
  // show in UI
  passwordDisplay.value = password;
  console.log(password)
  
  // calculate strength
  calcStrength();
})



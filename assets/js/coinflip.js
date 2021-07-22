/*
DONE:
1. Build basic UI for a coin-flipping game
1. Buy honestcasino.com
==========================================================
TODO:
1. Customer feedback mechanism
1. Announce on forums (Reddit/poker, Show HN, others)
1. NoSleep for phone browsers
0. Keyboard shortcuts (h,H=>Heads, t,T=> Tails)
2. Flipping Sound
3. Winning sound
*/

function updateResultText(functionName, tlang) {
  switch(functionName){
    case("load") :
      return tlang[0]["textLoading"];
      break;
    case("won") :
      return tlang[0]["textWon"];
      break;
    case("lost") :
      return tlang[0]["textLost"];
      break;
    case("claimError") :
      return tlang[0]["claimError"];
      break;
    default:
      return false;
  }
}
const isThai = () => {
  return (clientZone/60) === -7;
}
/* ====================== */
let sound = new Audio('assets/tick.mp3');


var result = 'heads';
var chosen = result;
var selectFlip;
var headClass = 'coin-heads';
var tailClass = 'coin-tails';

var balance;
var coinState;

const betUnit = 100;

const DGEBI = document.getElementById.bind(document);

var imgHead = DGEBI(headClass);
var imgTail = DGEBI(tailClass);
var btnHeads = DGEBI('btn-heads');
var btnTails = DGEBI('btn-tails');
var divResult = DGEBI('div-result');
var divBalance = DGEBI('div-balance');
var divReward = DGEBI('div-reward');
var divDebugInfo = DGEBI('div-debuginfo');
var inputMoney = document.querySelector("#inputMoney");
$("#waitBetting").hide();

/* Init game state; this function is intentionally unnamed, executed using IIFE */
(function(){
  balance = Number(CACbalance);
  reward = 0;
  coinState = 'stopped';
  divBalance.innerHTML = balance.toFixed(2);
})();

function serverGetRandomByte(callback) {
  var val = randomIntInc(0,255); // mimic NodeJS' `crypto.randomBytes(1)`
  setTimeout(function() {callback(val)}, 1000 * randomIntInc(1,3))
}

// Returns a random number in range [low,high]; that is, both ends of the range are inclusive
function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}
function checkINputAndBalance(){
  // if(inputMoney.value < CACbalance || inputMoney.value > CACbalance)
  // {
    // alert(`You betting don't lest than 0 Or not more than balance`);
    if(isThai())
    {
      document.querySelector(".divClaim").innerHTML +=
      `
      <div class="alert alert-danger alert-dismissible fade show divCliam" role="alert">
      ${updateResultText("claimError", tTH)} <strong>${CACbalance}</sctrong> CAC.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      </div>
      `;
    } else {
      document.querySelector(".divClaim").innerHTML +=
      `
      <div class="alert alert-danger alert-dismissible fade show divCliam" role="alert">
      ${updateResultText("claimError", tEN)} <strong>${CACbalance}</sctrong> CAC.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      </div>
      `;
    }
    setTimeout(function(){ 
      document.querySelector(".divClaim").innerHTML = "";
    }, 3000);
  //   return false;
  // }
}

function flip(p) {
  // checkINputAndBalance();
  chosen = p
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  startSpinning();
  
}

/*function toggleSpinning(){if(coinState==='spinning')stopSpinning();}else{startSpinning();}}*/

document.onkeypress = function(e){detectKeyPress(e)};
function detectKeyPress(e) {
  const key = e.key;
  if (key === 'h' || key === 'H') {
    flip('heads')
  } else if (key === 't' || key === 'T') {
    flip('tails')
  } else if (key === 'd') {
    divDebugInfo.style.display = 'none';
  } else if (key === 'D') {
    divDebugInfo.style.display = 'block';
  }
}

function updateResult() {
  divResult.innerHTML = result;
  
  
  if (debug) {
    divDebugInfo.innerHTML = debugText;
  } else {
    divDebugInfo.innerHTML = '';
  }
}

function startSpinning() {
  
  if (coinState === 'spinning')
    return;
  coinState = 'spinning';
  sound.currentTime = 1;
  sound.play();
  
  balance = balance - inputMoney.value; // betUnit;
  
  if(isThai())
  {
    result = `<h4 id="textLoading">${updateResultText("load", tTH)}</h4>`;
  } else {
    result = `<h4 id="textLoading">${updateResultText("load", tEN)}</h4>`;
  }
  //result = `<h4 id="textLoading">${updateResultText("load", setResultText)}</h4>`;

	

  updateResult();
  
  $("#btn-heads").hide();
  $("#btn-tails").hide();
  divBalance.innerHTML = balance.toFixed(2);
  btnHeads.disabled = btnTails.disabled = true;
  imgHead.classList.add(headClass);
  imgTail.classList.add(tailClass);
  imgHead.style.display = imgTail.style.display = 'block';

  serverGetRandomByte(stopSpinning);
}

function stopSpinning(val) {
  if (coinState === 'stopped')
    return;
  coinState = 'stopped';
  sound.pause();
  sound.currentTime = 0;
  
  $("#btn-heads").show();
  $("#btn-tails").show();
  $("#waitBetting").hide();
  $("#gameControl").show();
  btnHeads.disabled = btnTails.disabled = false;
  imgHead.classList.remove(headClass);
  imgTail.classList.remove(tailClass);

  if (val % 51 === 0) {
    /* The coin landed on edge; This is also the house-edge. */
    result = "edge";
  } else if (val % 2 === 0) {
    result = "heads";
    selectFlip = 0;
  } else {
    result = "tails";
    selectFlip = 1;
  }
  
  if (result === "edge") {
    divResult.innerHTML = 'Tile !!!';
    // balance = balance - inputMoney.value; // betUnit;
    divReward.innerHTML = balance - inputMoney.value;
  } else if (selectFlip == _gameResult) {

    console.log("SelectFlip = ", selectFlip);
    console.log("gameResult = ", _gameResult);
    reward = CACreward;
    playerReward();
    if(isThai())
    {
      divResult.innerHTML = `<h4 class="text-success" id="textLost">${updateResultText("won", tTH)}</h4>`;
    } else {
      divResult.innerHTML = `<h4 class="text-success" id="textLost">${updateResultText("won", tEN)}</h4>`;
    }
    // divResult.innerHTML = `<h4 class="text-warning" id="textWon">You won!!</h4>`;
    divReward.innerHTML = reward;
    // Send Tranaction to Blockchain
  } else {
    if(isThai())
    {
      divResult.innerHTML = `<h4 class="text-danger" id="textLost">${updateResultText("lost", tTH)}</h4>`;
    } else {
      divResult.innerHTML = `<h4 class="text-danger" id="textLost">${updateResultText("lost", tEN)}</h4>`;
    }
    // divResult.innerHTML = `<h4 class="text-danger" id="textLost">You lost.</h4>`;
  }
  
  divBalance.innerHTML = balance.toFixed(2);
  
  if (result === 'edge') {
    imgTail.style.display = 'none';
    imgHead.style.display = 'none';
  } else if (result === "heads") {
    imgTail.style.display = 'none';
  } else {
    imgHead.style.display = 'none';
  }

  // Debugging code
  if (debug) {
    iter = iter + 1;
    if (balance < lowBalance) lowBalance = balance;
    if (balance > highBalance) highBalance = balance;
    
    if (result === 'edge') edges = edges + 1;
    else if (result === 'heads') heads = heads + 1;
    else if (result === 'tails') tails = tails + 1;
    
    if (result === chosen) correctGuesses = correctGuesses +1;
    else wrongGuesses = wrongGuesses +1;

    debugText = `<table id='debuginfo'>`
    +`<tr><td>Random value</td><td>${val}</td></tr>`
    +`<tr><td>Total flips</td><td>${iter}</td></tr>`
    +`<tr><td>Landed on edge</td><td>${edges}</td></tr>`
    +`<tr><td>Landed on heads</td><td>${heads}</td></tr>`
    +`<tr><td>Landed on tails</td><td>${tails}</td></tr>`
    +`<tr><td>Correct guesses</td><td>${correctGuesses}</td></tr>`
    +`<tr><td>Wrong guesses</td><td>${wrongGuesses}</td></tr>`
    +`<tr><td>Low balance</td><td>${lowBalance}</td></tr>`
    +`<tr><td>High balance</td><td>${highBalance}</td></tr>`
    +`</table>`;
    
    updateResult();
    //setTimeout(function(){btnTails.click()}, 500)
  }
}


const claimReward = async () => {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  if(divReward.innerHTML == '0'){
    document.querySelector(".divClaim").innerHTML +=
  `
  <div class="alert alert-warning alert-dismissible fade show divCliam" role="alert">
  ขออภัย รางวัลของคุณมี <strong>0</strong> CAC.
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>
  `;
  setTimeout(function(){ 
    document.querySelector(".divClaim").innerHTML = "";
  }, 3000);
  return;
  }
  //alert(`Your claim ${reward} CAC Success.`);
  await withdrawReward();
  await checkCACBalance();
  document.querySelector(".divClaim").innerHTML +=
  `
  <div class="alert alert-success alert-dismissible fade show divCliam" role="alert">
  คุณกดรับรางวัลจำนวน <strong>${CACreward}</strong> CAC เรียบร้อยแล้ว กรุณารอเงินเข้ากระเป๋าสักครู่.
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>
  `;
  setTimeout(function(){ 
    document.querySelector(".divClaim").innerHTML = "";
  }, 3000);
  
  
  //divBalance.innerHTML = (balance + reward).toFixed(2);
  balance = CACbalance;
  reward = CACreward;
  divReward.innerHTML = 0;
  
}

const addBetting = (addBettingValue) => {
  inputMoney.value = parseInt(inputMoney.value) + parseInt(addBettingValue);
}
const resetBetting = () => {
  inputMoney.value = 0;
}

var debug = false;
var debugText = '';
var iter = 0;
var edges = 0;
var heads = 0;
var tails = 0;
var correctGuesses = 0;
var wrongGuesses = 0;
var lowBalance = balance;
var highBalance = balance;

 window.addEventListener('load', function() {
    // Check if Web3 has been injected by the browser (Mist/MetaMask).
    if (typeof window.ethereum === 'undefined') {
      // Use Mist/MetaMask's provider.
      alert('Please install Metamask. from metamask.io');
      web3 = new Web3(web3.currentProvider);
      return;
    } 
    
  });

const web3 = new Web3(Web3.givenProvider || "https://bsc-dataseed1.binance.org:443");
// const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed1.binance.org:443'));

// ======================= Set Varialble =======================
let WalletAccounts = "0x0000000000000000000000000000000000000000"; // set default letiable
const CACaddress = "0x369BF6FC83FdAB81AbB2AB41D0CB7206b3A5c584";
const CoinFlipAddress = "0x40d6765DD003202E11E70fe86947d51DD269Cb77";
// Set Varialble after Get Account Address
const CACtoken = new web3.eth.Contract(CACabi, CACaddress);
const ConFlip = new web3.eth.Contract(CoinFlipABI, CoinFlipAddress);
let ApproveFromCAC = 0;
let CACbalance = 0;
let CACreward = 0;
let _gameResult;

web3.eth.getBlockNumber().then((result) => {
  console.log("Latest BSC Block is ",result);
});

// ============================================================
// Get Wallet Account and call to Get CAC Balance Function
const web3getAccount = async () => {
        
    // await window.ethereum.enable();
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    // const accounts = await web3.eth.getAccounts(); 
    WalletAccounts = accounts[0];
    document.querySelector("#wlletAccount").innerHTML = `<button class="btn btn-dark dtn-sm text-warning">${WalletAccounts.substr(0,4)}...${WalletAccounts.substr(-4)}</button>`;
    checkCACBalance(WalletAccounts);
    playerReward(WalletAccounts);
    playerApproveFromCAC(WalletAccounts, CoinFlipAddress);


    // Time to reload your interface with accounts[0]!
    ethereum.on('accountsChanged', function (accounts) {
      WalletAccounts = accounts[0];
      document.querySelector("#wlletAccount").innerHTML = `<button class="btn btn-dark dtn-sm text-warning">${WalletAccounts.substr(0,4)}...${WalletAccounts.substr(-4)}</button>`;
      checkCACBalance(WalletAccounts);
      playerReward(WalletAccounts);
      playerApproveFromCAC(WalletAccounts, CoinFlipAddress);

    });

    
    
  }
  web3getAccount();
// ============================================================

/*============================================================
====================== Reade Contract ======================*/

// Get CAC Balance Function
const checkCACBalance = async (WalletAccounts) => {
  await CACtoken.methods
  .balanceOf(WalletAccounts)
  .call((err, res) => {
    if (err) {
      console.log("An error occured", err)
      return
    }
      let balanceOfWallet = web3.utils.fromWei(res);
      CACbalance = balanceOfWallet;
      balance = CACbalance;
      document.querySelector("#div-balance").innerHTML = parseFloat(CACbalance).toFixed(2);
    });
  
}

// Check CAC Allowance Function
const playerApproveFromCAC = async (WalletAccountss, CoinFlipAddresss) => {
  await CACtoken.methods
  .allowance(WalletAccountss, CoinFlipAddresss)
  .call({from: WalletAccountss}, (err, res) => {
    if (err) {
      console.log("An error occured", err)
      return
    }
      let playerApprove = web3.utils.fromWei(res);
      ApproveFromCAC = playerApprove;
      if(ApproveFromCAC > 0)
      {
        document.querySelector("#iconLock").setAttribute("style", "display: none;");
        document.querySelector("#gameControl").setAttribute("style", "display: inline;");
      } else {
        document.querySelector("#iconLock").setAttribute("style", "display: inline;");
        document.querySelector("#gameControl").setAttribute("style", "display: none;");
      }
    });
}
// Add CAC Allowance Function
 const addAllowance = async () => {
  let amountMaxWei = web3.utils.toWei("1000000000000");

  await CACtoken.methods.approve(CoinFlipAddress, amountMaxWei).send({ from: WalletAccounts, gasLimit: 300000}, (err, res) => {
    if (err) {
      console.log("An error occured", err)
      return
    }
    console.log(res);
    playerApproveFromCAC(WalletAccounts, CoinFlipAddress);
    });

}


// Betting Function
const playerBet = async (coinSide) => {

  let inputMoney = document.querySelector("#inputMoney");
  let betAmount = web3.utils.toWei(inputMoney.value);
  let _coinSide;

  if(Number(inputMoney.value) <= 0 || Number(inputMoney.value) > Number(CACbalance))
  {
    console.log(Number(inputMoney.value));
    console.log(Number(CACbalance));
    checkINputAndBalance();
    return;
  }

  //console.log(betAmount);
  if(coinSide == 'heads')
  {
    _coinSide = 0;
  } else if(coinSide == 'tails'){
    _coinSide = 1;
  }
  await ConFlip.methods.betting(_coinSide, betAmount).send({ from: WalletAccounts, gas: 400000}, function(error, transactionHash){
    if(error){
      console.log(error);
      return;
    }
      console.log(transactionHash);
      $("#btn-heads").hide();
      $("#btn-tails").hide();
      $("#gameControl").hide();
      $("#waitBetting").show();
    }
  )
  .then((res) => {
    betResult();
    flip(coinSide);
  });
}

// Get Bet Result Function
const betResult = async () => {
  await ConFlip.methods
  .gameResult(WalletAccounts)
  .call((err, res) => {
    if (err) {
      console.log("An error occured", err)
      return
    }
      _gameResult = res;
    });
}

// Get CAC Reward Function
const playerReward = async () => {
  await ConFlip.methods
  .playerReward(WalletAccounts)
  .call((err, res) => {
    if (err) {
      console.log("An error occured", err)
      return
    }
      let balanceOfplayerReward = web3.utils.fromWei(res);
      CACreward = balanceOfplayerReward;
      // console.log(CACreward);
      document.querySelector("#div-reward").innerHTML = parseFloat(CACreward).toFixed(2);
    });
}

// Add CAC Allowance Function
const withdrawReward = async () => {
  let amount = web3.utils.toWei(CACreward);

  await ConFlip.methods.withdrawReward(amount).send({ from: WalletAccounts, gasLimit: 300000}, (err, res) => {
    if (err) {
      console.log("An error occured", err)
      return
    }
     console.log(res);
     
    })
    .then(() => {
      playerReward();
    });

}

const onClickConnect = async () => {
  try {
    // Will open the MetaMask UI
    // You should disable this button while the request is pending!
    await ethereum.request({ method: 'eth_requestAccounts' });
  } catch (error) {
    console.error(error);
  }
};

/*============================================================
====================== Write Contract ======================*/
// Get CAC Reward Function
const callBetting = async (WalletAccounts) => {
  await ConFlip.methods
  .playerReward(WalletAccounts)
  .call((err, res) => {
    if (err) {
      console.log("An error occured", err)
      return
    }
      let balanceOfplayerReward = web3.utils.fromWei(res);
      CACreward = balanceOfplayerReward;
      console.log(CACreward);
      document.querySelector("#div-balance").innerHTML = parseFloat(CACreward).toFixed(2);
    });
}

// =============================================== //
// Call Function
playerReward();
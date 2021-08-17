/*
* On page load
*/
window.addEventListener("load", () => {
    // Load Crypto list
    $(".navbar").load("components/header.html");
    $("#tradingviewCryptoList").load("components/cryptoListFromTradingviews.html");


    new TradingView.widget(
        {
        "width": "100%",
        "height": 615,
        "symbol": "BINANCE:BNBUSDT",
        "interval": "60",
        "timezone": "Etc/UTC",
        "theme": "light",
        "style": "1",
        "locale": "th_TH",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "container_id": "tradingview_8c3f4"
      }
    );
});

/* 
/* @dev set state variable
*
*/
const priceAPI = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&symbols=";
const assetsStorage = "https://amorthem.github.io/copytrade/assetsLists.json"; //"https://192.168.1.43/0_Copytrade/assetsLists.json"; // Pancake Default Token list = https://gateway.pinata.cloud/ipfs/QmdKy1K5TMzSHncLzUXUJdvKi1tHRmJocDRfmCXxW5mshS
let price_change_24h;
let logsTrading = document.querySelector("#logsTrading");
let logsHistory = document.querySelector("#logsHistory");

/*
 * @function Cut USDT in token pair
 * Example.
 *   - BNBUSDT => BNB
 *   - DOGEUSD => DOGE
 */
const symbolPair1 = (token) => {
    return token.substr(0, token.length - 4); // -4 is USDT (Pair2)
  };

/*
* @function Load Assets IMG
*/

const loadAssetsImg = (symbols, logoURI) => {
    document.querySelector("#symbol" + symbols).innerHTML = `<img src="${logoURI}" height="25" class="rounded-circle"> &nbsp;&nbsp;${symbols}`;
};

/*
* @function push Assets table
*/
const addAssetsWatchList = (symbol) => {
    
document.querySelector("#tokenCard").innerHTML += `
    <li class="list-group-item" id="listGroupItem${symbol}" onclick="reloadComponents('${symbol}')">
        <div class="d-flex justify-content-between" id="listItem${symbol}">
          <strong><span id="symbol${symbol}">${symbol}</span></strong>
          <div>
            <span id="price${symbol}" class="text-dark"></span>
            <small id="priceColor${symbol}">( <i class="fas fa-caret-down" id="priceUpDown${symbol}"></i> <span id="percentChange${symbol}"></span>)</small>
          </div>
        </div>
    </li>
    `;
};

/*
* @function Update Data price realtime
*/

    const getPrice = async (symbol) => {
        if(symbol === "") throw  new Error("Symbol NULL");
        let {prices, price, percentChange24, p0, p1} = 0;
        let {listGroupItem, txtPrice, priceColor, priceUpDown, percentChange} = "";
        const response = await fetch("https://api.binance.com/api/v3/ticker/24hr?symbol=" + symbol + "USDT");
        const data = await response.json();

        txtPrice = document.querySelector("#price" + symbol);
        percentChange = document.querySelector("#percentChange" + symbol);
        priceColor = document.querySelector("#priceColor" + symbol);
        priceUpDown = document.querySelector("#priceUpDown" + symbol);
        listGroupItem = document.querySelector("#listGroupItem" + symbol);
        
        
        prices = data.lastPrice;
        price = parseFloat(prices).toFixed(4);
        percentChange24 = data.priceChangePercent;

        txtPrice.innerHTML = price;
        percentChange.innerHTML = percentChange24 + " %";
        
        parseFloat(prices) >= parseFloat(txtPrice.innerHTML)
            ? listGroupItem.setAttribute("class", "list-group-item bg-success")
            : listGroupItem.setAttribute("class", "list-group-item bg-danger text-light")
            // ? txtPrice.setAttribute("class", "text-success")
            // : txtPrice.setAttribute("class", "text-danger")

        parseFloat(percentChange24) >= 0
            ? priceUpDown.setAttribute("class", "fas fa-caret-up")
            : priceUpDown.setAttribute("class", "fas fa-caret-down")
        
        parseFloat(percentChange24) >= 0
            ? priceColor.setAttribute("class", "text-success")
            : priceColor.setAttribute("class", "text-danger")
  }


/*
* @function Load Assets And Token list
*/

const getAssets = async () => {
    const response = await fetch(assetsStorage);
    const data = await response.json();
    data.tokens.forEach(tokenId => {
        //addAssetsWatchList(tokenId.symbol);
        //loadAssetsImg(tokenId.symbol, tokenId.logoURI);
        document.querySelector("#selectSymbolList").innerHTML += `
        <span class="dropdown-item" onclick="selectSymbolList('${tokenId.symbol}', '${tokenId.address}');" >
          <img src="https://pancakeswap.finance/images/tokens/${tokenId.address}.svg" height="35"> <strong>${tokenId.symbol}</strong>
        </span>
        `;
    })
}

/*
 * @function reload components
 *   - News
 *   - Chart
 *   - Assets to Invest
 */
const reloadComponents = (symbol) => {
  document.querySelector("#news-articles").setAttribute("src", `https://lunarcrush.com/widgets/news?symbol=${symbol}&interval=1 Week&animation=false&theme=light`);

  new TradingView.widget({
    width: "100%",
    height: 620,
    symbol: "BINANCE:" + symbol + "USDT",
    interval: "60",
    timezone: "Etc/UTC",
    theme: "light",
    style: "1",
    locale: "th_TH",
    toolbar_bg: "#f1f3f6",
    enable_publishing: false,
    hide_side_toolbar: false,
    allow_symbol_change: true,
    container_id: "tradingview_8c3f4",
  });
};


const _logsTrading = () => {
    logsTrading.setAttribute("style", "display: block-inline;");
    logsHistory.setAttribute("style", "display: none;");
}
const _logsHistory = () => {
    logsTrading.setAttribute("style", "display: none;");
    logsHistory.setAttribute("style", "display: block-inline;");
}

const selectSymbolList = (symbol, symbolLogo) => {
    reloadComponents(symbol);
    document.querySelector("#selectSymbolValue").value = symbol;
    document.querySelector("#chartSymbol").innerHTML = symbol;
    document.querySelector("#symbolSelectDefultimg").setAttribute("src", `https://pancakeswap.finance/images/tokens/${symbolLogo}.svg`);
    document.querySelector("#symbolSelectDefult").innerHTML = symbol;
}
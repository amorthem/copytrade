/*
* On page load
*/
window.addEventListener("load", () => {
    new TradingView.widget(
        {
        "width": "100%",
        "height": 615,
        "symbol": "BINANCE:BTCUSDT",
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
            <span id="price${symbol}"></span>
            <small id="priceColor${symbol}">( <i class="fas fa-caret-down" id="priceUpDown${symbol}"></i> <span id="percentChange${symbol}"></span>)</small>
          </div>
        </div>
    </li>
    `;
};

/*
* @function Update Data price realtime
*/

    const getPrice = (symbol, timeRequest) => {
        let {prices, price, percentChange24, p0, p1} = 0;
        let {listGroupItem, txtPrice, priceColor, priceUpDown, percentChange} = "";
    setInterval( async () => {
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
            ? txtPrice.setAttribute("class", "text-success")
            : txtPrice.setAttribute("class", "text-danger")

        parseFloat(percentChange24) >= 0
            ? priceUpDown.setAttribute("class", "fas fa-caret-up")
            : priceUpDown.setAttribute("class", "fas fa-caret-down")
        
        parseFloat(percentChange24) >= 0
            ? priceColor.setAttribute("class", "text-success")
            : priceColor.setAttribute("class", "text-danger")
      }, timeRequest);
  }


/*
* @function Load Assets
*/
const getAssets = async () => {
    const response = await fetch(assetsStorage);
    const data = await response.json();
    data.tokens.forEach(tokenId => {
        //getAssets(tokenId.symbol, tokenId.address);
        addAssetsWatchList(tokenId.symbol);
        loadAssetsImg(tokenId.symbol, tokenId.logoURI);
        document.querySelector("#assetLists").innerHTML += `<option value="${tokenId.symbol}">${tokenId.symbol}</option>`;
        getPrice(tokenId.symbol, 3000);
    })

    
}


/*
* @function Load Assets And Update Price realtime
*/
const getAssetsStorage = () => {
      //getAssetsTotal();
    /*assetsStorage.forEach((_assetsStorage) => {
      getPrice(_assetsStorage.symbol, 1000);
    })*/
  }


/*
 * @function reload components
 *   - News
 *   - Chart
 *   - Assets to Invest
 */
const reloadComponents = (symbol) => {
  document.querySelector("#assetLists").value = symbol;
  document.querySelector("#news-articles").setAttribute("src", `https://lunarcrush.com/widgets/news?symbol=${symbol}&interval=1 Week&animation=false&theme=light`);

  new TradingView.widget({
    width: "100%",
    height: 620,
    symbol: "BINANCE:" + symbol + "usdt",
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
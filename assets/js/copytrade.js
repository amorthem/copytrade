/*
* On page load
*/
window.addEventListener("load", () => {
    new TradingView.widget(
        {
        "width": "99%",
        "height": 615,
        "symbol": "BINANCE:BTCUSDT",
        "interval": "60",
        "timezone": "Etc/UTC",
        "theme": "dark",
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
* @function push Assets table
*/
const addAssetsWatchList = (symbol) => {
document.querySelector("#tokenCard").innerHTML += `
    <li class="list-group-item bg-dark text-light" onclick="reloadComponents('${symbol}')">
        <div class="d-flex justify-content-between">
          <strong><span id="symbol${symbol}"></span></strong>
          <div>
            <span class="text-light" id="price${symbol}"></span>
            <small id="priceColor${symbol}">( <i class="fas fa-caret-down text-light" id="priceUpDown${symbol}"></i> <span id="percentChange${symbol}"></span>)</small>
          </div>
        </div>
    </li>
    `;
};

/*
* @function Load Assets IMG
*/

const loadAssetsImg = async (symbols) => {
  const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&symbols=" +symbolPair1(symbols).toLowerCase());
  const tokenData = await response.json();

  const response2 = await fetch("https://tokens.venus.io/");
  const tokenData2 = await response2.json();
  
   
  document.querySelector("#symbol" + symbols).innerHTML = `<img src="${tokenData[0].image}" height="30" class="rounded-circle"> &nbsp;&nbsp;${symbolPair1(symbols)}`;
};
/*
* @function Load Assets
*/
const getAssets = (symbol) => {
  addAssetsWatchList(symbol);
  loadAssetsImg(symbol);
  document.querySelector("#assetLists").innerHTML += `<option value="${symbol}">${symbol}</option>`;

  setInterval(() => {
    let txtPrice = document.querySelector("#price" + symbol);
    let priceColor = document.querySelector("#priceColor" + symbol);
    let priceUpDown = document.querySelector("#priceUpDown" + symbol);
    let percentChange = document.querySelector("#percentChange" + symbol);

    fetch("https://api.binance.com/api/v3/ticker/24hr?symbol=" + symbol)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        //console.log(data.price);
        let prices = data.lastPrice;
        let price = parseFloat(prices).toFixed(4);
        let percentChange24 = data.priceChangePercent;
        let p0 = txtPrice.innerHTML.toLocaleString();
        let p1 = price.toLocaleString();

        if (p1 >= p0) {
          priceColor.setAttribute("class", "text-success");
          priceUpDown.setAttribute("class", "fas fa-caret-up");
          txtPrice.innerHTML = price;
          percentChange.innerHTML = percentChange24 + " %";
        } else {
          priceColor.setAttribute("class", "text-danger");
          priceUpDown.setAttribute("class", "fas fa-caret-down");
          txtPrice.innerHTML = price;
          percentChange.innerHTML = percentChange24 + " %";
        }
      });
  }, 5000);
};


/*
 * @function reload components
 *   - News
 *   - Chart
 *   - Assets to Invest
 */
const reloadComponents = (symbol) => {
  document.querySelector("#assetLists").value = symbol;
  document.querySelector("#news-articles").setAttribute("src", `https://lunarcrush.com/widgets/news?symbol=${symbolPair1(symbol)}&interval=1 Week&animation=false&theme=dark`);

  new TradingView.widget({
    width: "99%",
    height: 620,
    symbol: "BINANCE:" + symbol,
    interval: "60",
    timezone: "Etc/UTC",
    theme: "dark",
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
    // document.querySelector("btnLogsTrading").setAttribute("class", "btn btn-secondary btn-md");
    // document.querySelector("btnLogsHistory").setAttribute("class", "btn btn-light btn-sm");
    logsTrading.setAttribute("style", "display: block-inline;");
    logsHistory.setAttribute("style", "display: none;");
}
const _logsHistory = () => {
    //document.querySelector("btnLogsHistory").setAttribute("class", "btn btn-light btn-sm");
    //document.querySelector("btnLogsHistory").setAttribute("class", "btn btn-secondary btn-md");
    logsTrading.setAttribute("style", "display: none;");
    logsHistory.setAttribute("style", "display: block-inline;");
}
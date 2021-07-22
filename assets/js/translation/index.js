let clientZone = new Date().getTimezoneOffset();
if((clientZone/60) === -7)
{
    setTranslation(tTH);
} else {
    setTranslation(tEN);
}

function setTranslation(tlang) {
    document.querySelector("#textAccount").innerHTML = tlang[0]["textAccount"];
    // document.querySelector("#textBalance").innerHTML = tlang[0]["textBalance"];
    document.querySelector("#textPrize").innerHTML = tlang[0]["textPrize"];
    document.querySelector("#btnClaimReward").innerHTML = tlang[0]["btnClaimReward"];
    document.querySelector("#btn-heads").innerHTML = tlang[0]["btnHeads"];
    document.querySelector("#btn-tails").innerHTML = tlang[0]["btnTails"];
    document.querySelector("#imgCoinFlipsH").setAttribute('src', tlang[0]["btnHeads"]);
    document.querySelector("#imgCoinFlipsT").setAttribute('src', tlang[0]["btnTails"]);
    document.querySelector("#btn-heads").setAttribute('src', tlang[0]["btnHeads"]);
    document.querySelector("#btn-tails").setAttribute('src', tlang[0]["btnTails"]);
}




const btnLangTH = document.querySelector('#btnLangTH');
const btnLangEN = document.querySelector('#btnLangEN');

btnLangTH.addEventListener("click", () => {
    setTranslation(tTH);
    btnLangTH.setAttribute("class", "btn btn-info btn-sm");
    btnLangEN.setAttribute("class", "btn btn-outline-info btn-sm");
})
btnLangEN.addEventListener("click", () => {
    setTranslation(tEN);
    btnLangEN.setAttribute("class", "btn btn-info btn-sm");
    btnLangTH.setAttribute("class", "btn btn-outline-info btn-sm");
})
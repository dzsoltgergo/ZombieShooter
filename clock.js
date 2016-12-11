// Get userprefs
//var prefs = new gadgets.Prefs();
//var targetMonth = prefs.getInt("targetMonth");
//var targetDate = prefs.getInt("targetDate");
//var targetYear = prefs.getInt("targetYear");
var targetEvent = "__UP_eventname__";
var targetMonth = 12;
var targetDate = 11;
var targetYear = 2016;
var targetHour = 13;
var targetMinute = 59;
if (targetEvent=="New Year") document.getElementById("EventHeader").innerHtml=targetEvent + " " + targetYear;
function countDownTimerTick()
{
    var targetDateTime = new Date(targetYear,targetMonth-1,targetDate,targetHour,targetMinute,0,0);
    var nowDateTime = new Date();
    var cntMSec = targetDateTime - nowDateTime;
    var divider = 86400000;
    var dRem = 0;
    var hRem = 0;
    var mRem = 0;
    var sRem = 0;
    var cRem = 0;
    if (cntMSec > 0) {
        dRem = Math.floor(cntMSec / divider);
        cntMSec = cntMSec - (dRem * divider);
        divider = divider / 24;
        hRem = Math.floor(cntMSec / divider);
        cntMSec = cntMSec - (hRem * divider);
        divider = divider / 60;
        mRem = Math.floor(cntMSec / divider);
        cntMSec = cntMSec - (mRem * divider);
        divider = divider / 60;sRem = Math.floor(cntMSec / divider);
    }
    document.getElementById("eD0").innerHTML = dRem;
    document.getElementById("eH0").innerHTML = hRem;
    document.getElementById("eM0").innerHTML = mRem;
    document.getElementById("eS0").innerHTML = sRem;
    document.getElementById("eH1").innerHTML = hRem + (dRem * 24);
    document.getElementById("eM1").innerHTML = mRem + ((hRem + (dRem * 24)) * 60);
    document.getElementById("eS1").innerHTML = sRem + ((mRem + ((hRem + (dRem * 24)) * 60)) * 60);
}
window.setInterval("countDownTimerTick();",1000);
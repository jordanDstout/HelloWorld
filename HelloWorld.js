/**
 * Created by jordanstout on 6/5/15.
 */
var moment= require("moment");
var globalize = require( "globalize" );
// Before we can use Globalize, we need to feed it on the appropriate I18n content (Unicode CLDR). Read Requirements on Getting Started on the root's README.md for more information.
globalize.load(
    require("cldr-data/main/pt/ca-gregorian.json"),
    require("cldr-data/main/pt/timeZoneNames.json"),
    require("cldr-data/supplemental/timeData.json"),
    require("cldr-data/supplemental/weekData.json"),
    require("cldr-data/main/pt/numbers.json"),
    require("cldr-data/main/en/ca-gregorian"),
    require("cldr-data/main/en/currencies"),
    require("cldr-data/main/en/dateFields"),
    require("cldr-data/main/en/numbers"),
    require("cldr-data/supplemental/currencyData"),
    require("cldr-data/supplemental/likelySubtags"),
    require("cldr-data/supplemental/plurals"),
    require("cldr-data/supplemental/timeData"),
    require("cldr-data/supplemental/weekData"),
    require("cldr-data/supplemental/ordinals.json")
);
//this is from the EXAMPLE doc in Globalize. Gives a premade message that I can mess with.
// Not needed but was good for checking myself.
globalize.loadMessages(require("globalize/examples/node-npm/messages/en.json"));


//today's date. Needed for parameters
var dateToday= new Date();

globalize.loadMessages({
    en: {
        //I need a: time ago, time, date, number

        StakePlaced: "Congratulations, user named {userName}.  " +
        "You placed Stake #{stakeNumber}." +
        " It was placed {timeAgo}," +
        "the {ordinal} stake today at {time}, {date}"+
        " and was the {overall} placement overall.",
        StakeNotPlaced: "Sorry, user {userName} your stake failed to place"
    },
    pt:{
        StakePlaced: "PT_____Congratulations, user named {userName}.  " +
        "You placed Stake #{stakeNumber}." +
        " It was placed {timeAgo}," +
        "the {ordinal} stake today at {time}, {date}"+
        " and was the {thing} placement overall.",
        StakeNotPlaced: "Sorry, user {userName} your stake failed to place"
    }
});

// You placed stake _#12345_.  It was placed _five minutes ago_, the _3rd_ stake _today_ at 1:34 pm, _6/12/15_, and number _9,234_ overall.
//the things between the _ _ need to be globalized, the rest would need to be translated.
//this is a function that creates the parameters for the message call later. I made it a function
//so that the default location could be independent of the one previously set.
//Later in my call of this, I pass the default locale as a parameter in another function.
var dictfunct= function (userName,stakeNumber,ordinal,overall){
    var returnable={};
    returnable["userName"]=userName;
    returnable["stakeNumber"]=stakeNumber;
    returnable["timeAgo"]=moment().subtract(5, 'minutes').fromNow();
    returnable["ordinal"]=moment.localeData().ordinal(ordinal);
    returnable["time"]=globalize.dateFormatter({ time: "medium" })(dateToday);
    returnable["date"]= globalize.dateFormatter()(dateToday);
    returnable["overall"]=globalize.numberFormatter()(overall);
    return returnable;
}

//locale is a globalize/moment locale
//message is a string that correlates with a message parameter (StakePlaced/StakeNotPlaced)
var messagemaker= function formatter(locale,message,userName,stakeNumber,ordinal,thing){
    globalize.locale(locale);
    moment.locale(locale);
    var parameters=dictfunct(userName,stakeNumber,ordinal,thing);
    return globalize.messageFormatter(message)(parameters);
}
var En=messagemaker("en","StakePlaced","Jordan","12345",1234,9234);

//english
console.log(En);

var Pt=messagemaker("pt","StakePlaced","Jordan","12345",1234,9234);
//portuguese
console.log(Pt);
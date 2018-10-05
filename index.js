'use strict';
var Alexa = require('alexa-sdk');
var APP_ID = undefined;
var GET_FACT_MSG_EN = [
    "Here's your fact: "
    ,"This is your fact: "
    ,"Did you know this? "
    ,"I bet this is new to you: " 
]
var GET_REPROMPT_MSG_EN = [
    "Why don't you ask me for a fact of another year? ",
    "Tell me which year do you want a fact from.",
    "If you want another fact, please tell me so.",
    "Feel free to ask for more facts.",
    "I'll be waiting in case you want to know more facts."
]




exports.GetFactMsg = GET_FACT_MSG_EN;
exports.GetRepromtMsg = GET_REPROMPT_MSG_EN;

var randomGetFactIndex;
var randomGetFact;
var languageStrings = {
    "en": {
        "translation": {
            "FACTS": facts.FACTS_EN,
            
            "SKILL_NAME": "Hvy D Computer Facts",  
            "GET_FACT_MESSAGE": GET_FACT_MSG_EN,
            "HELP_MESSAGE": "You can say tell me a fact, or, you can say exit... What can I help you with?",
            "GET_REPROMPT_MESSAGE": GET_REPROMPT_MSG_EN,
            "HELP_REPROMPT_WITH_DATE": "What would you like to know? You just need to give me a year and I will provide a fact.", // added PART 3
            "HELP_REPROMPT": "What can I help you with?",
            "STOP_MESSAGE": "Goodbye!",
            "NO_DATE_PROVIDED": "Sorry, I did not get any date. Please let me know which year interests you.",
            "NO_DATE_FOUND": "Sorry, but I don\'t have any fact for that date. But here\'s another fact:"
        }
    }
};
exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // set a test appId if running the mocha local tests
    if (event.session.application.applicationId == "mochatest") {
        alexa.appId = APP_ID_TEST
    }
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};



var handlers = {
    'LaunchRequest': function () {
        this.emit('GetFact');
    },
    'GetNewFactIntent': function () {
        this.emit('GetFact');
    },
    'GetFact': function () {
        // create a random opening
        randomGetFactIndex = Math.floor(Math.random() * GET_FACT_MSG_EN.length);
        randomGetFact = GET_FACT_MSG_EN[randomGetFactIndex];
        languageStrings["en"]["translation"]["GET_FACT_MESSAGE"] = randomGetFact;

        // create a reprompt and card messages
        var reprompt = this.t("HELP_REPROMPT_WITH_DATE");
        var cardTitle = this.t("SKILL_NAME");
        var cardContent = '';

        // Get a random fact from the facts list
        // Use this.t() to get corresponding language data
        var factArr = this.t('FACTS');
        var randomFact = randomPhrase(factArr);

        // Create speech output
        var speechOutput = this.t("GET_FACT_MESSAGE") + randomFact;
        cardContent = randomFact;
        //this.emit(':askWithCard', speechOutput, this.t("SKILL_NAME"), randomFact);
        this.emit(':askWithCard', speechOutput, reprompt, cardTitle, cardContent);
    },
    'GetNewYearFactIntent': function () {
        
        // get the year from the slots
        var year = this.event.request.intent.slots["FACT_YEAR"].value;
        var factArr = this.t('FACTS');

        //randomize getFact message
        randomGetFactIndex = Math.floor(Math.random() * GET_FACT_MSG_EN.length);
        randomGetFact = GET_FACT_MSG_EN[randomGetFactIndex];
        languageStrings["en"]["translation"]["GET_FACT_MESSAGE"] = randomGetFact;

        // create a reprompt and card messages
        var reprompt = this.t("HELP_REPROMPT_WITH_DATE");
        var cardTitle = this.t("SKILL_NAME");
        var cardContent = '';

        //check that the user gave a year
        if (year === null) {
            var speechOutput = this.t("NO_DATE_PROVIDED");
            cardContent = reprompt;
            this.emit(':askWithCard', speechOutput, reprompt, cardTitle, cardContent);        
        } else {
            var factArr = this.t('FACTS');
            var result = '';
            result = selectPhraseByYear(factArr, year);
            // if the year is not included in the fact,
            // return a random fact after the appropriate message
            if (result === null) { 
                // Get a random fact from the facts list
                var randomFact = randomPhrase(factArr);
                // create speech output
                var speechOutput = this.t("NO_DATE_FOUND") + randomFact;
                cardContent = randomFact;
                //this.emit(':askWithCard', speechOutput, this.t("SKILL_NAME"), randomFact, reprompt, card);
                this.emit(':askWithCard', speechOutput, reprompt, cardTitle, cardContent);

            } else {
                // find relevant fact
                var relevantFact = result;
                cardContent = relevantFact;
                // create speech output
                var speechOutput = this.t("GET_FACT_MESSAGE") + relevantFact;
                //this.emit(':askWithCard', speechOutput, this.t("SKILL_NAME"), relevantFact, reprompt, card);
                this.emit(':askWithCard', speechOutput, reprompt, cardTitle, cardContent);                
            }
        }
    },

    'AMAZON.HelpIntent': function () {
        var speechOutput = this.t("HELP_MESSAGE");
        var reprompt = this.t("HELP_MESSAGE");
        this.emit(':ask', speechOutput, reprompt);
    
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'SessionEndedRequest': function() {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    }

};
function randomPhrase(phraseArr) {
    // returns a random phrase
    // where phraseArr is an array of string phrases
    var i = 0;
    i = Math.floor(Math.random() * phraseArr.length);
    return (phraseArr[i]);
}

// added by me
function selectPhraseByYear(phraseArr, year) {
    // search a fact that mentions the selected year. 
    // If no such fact exists, provide a random phrase
    var i = 0;
    for (i = 0; i < phraseArr.length; i++) { 
        if (phraseArr[i].indexOf(year.toString()) > -1) {
            return phraseArr[i];
        }
    }
    return null
}



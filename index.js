'use strict';
var Alexa = require('alexa-sdk');
var APP_ID = undefined;  // can be replaced with your app ID if publishing
var facts = require('./facts');
var GET_FACT_MSG_EN = [
    "Here's your fact: "
    ,"This is your fact: "
    ,"Did you know this? "
    ,"What about this? "
    ,"I bet this is new to you: " 
]
var GET_REPROMPT_MESSAGE_EN = [
    "Why don't you ask me for a fact of another year? ",
    "Tell me which year do you want a fact from.",
    "If you want another fact, please tell me so.",
    "Feel free to ask for more facts.",
    "I'll be waiting in case you want to know more facts."
]
// Test hooks - do not remove!
exports.GetFactMsg = GET_FACT_MSG_EN;
var APP_ID_TEST = "mochatest";  // used for mocha tests to prevent warning
// end Test hooks
/*
    TODO (Part 2) add messages needed for the additional intent
    TODO (Part 3) add reprompt messages as needed
*/
var languageStrings = {
    "en": {
        "translation": {
            "FACTS": facts.FACTS_EN,
            "SKILL_NAME": "My History Facts",  // OPTIONAL change this to a more descriptive name
            "GET_FACT_MESSAGE": GET_FACT_MSG_EN,
            "GET_REPROMPT_MESSAGE": GET_REPROMPT_MESSAGE_EN,
            "HELP_MESSAGE": "You can say tell me a fact, or, you can say exit... What can I help you with?",
            "HELP_REPROMPT": "What can I help you with?",
            "STOP_MESSAGE": "Goodbye!"
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

/*
    TODO (Part 2) add an intent for specifying a fact by year named 'GetNewYearFactIntent'
    TODO (Part 2) provide a function for the new intent named 'GetYearFact' 
        that emits a randomized fact that includes the year requested by the user
        - if such a fact is not available, tell the user this and provide an alternative fact.
    TODO (Part 3) Keep the session open by providing the fact with :askWithCard instead of :tellWithCard
        - make sure the user knows that they need to respond
        - provide a reprompt that lets the user know how they can respond
    TODO (Part 3) Provide a randomized response for the GET_FACT_MESSAGE
        - add message to the array GET_FACT_MSG_EN
        - randomize this starting portion of the response for conversational variety
*/
const handlers = {
    'LaunchRequest': function () {
        this.emit('GetFact');
    },
    'GetNewFactIntent': function () {
        this.emit('GetFact');
    },
    'GetFact': function () {
        // Get a random space fact from the space facts list
        // Use this.t() to get corresponding language data
        const factArr = this.t('FACTS');
        const factIndex = Math.floor(Math.random() * factArr.length);
        const randomFact = factArr[factIndex];

        // Create speech output
        const speechOutput = this.t('GET_FACT_MESSAGE') + randomFact;
        this.emit(':tellWithCard', speechOutput, this.t('SKILL_NAME'), randomFact);
    },
     'GetNewYearFactIntent': function () {
        //TODO your code here
        var answerSlotValid = isAnswerSlotValid(this.event.request.intent);
        if(answerSlotValid){
            var selected_year = parseInt(this.event.request.intent.slots.FACT_YEAR.value);
            //This is hardcoded although it could be parsed automatically from facts.js
            var years_mapping = [];
            years_mapping[1950]=0;
            years_mapping[1956]=1;
            years_mapping[1997]=2;
            years_mapping[1974]=3;
            years_mapping[2005]=4;
            years_mapping[1800]=5;
            years_mapping[1960]=6;
            years_mapping[1982]=7;
            years_mapping[1958]=8;
            years_mapping[1976]=9;
            years_mapping[2010]=10;
            var responses = this.t("FACTS");
            if(typeof years_mapping[selected_year] === 'undefined'){
                //Provide a random fact if the year is not found in the fact list
                this.emit('GetFact');
            }else{
                // Create speech output
                var randomGetFactMessage = randomPhrase(this.t("GET_FACT_MESSAGE"));
                var fact = responses[years_mapping[selected_year]];
                var speechOutput = randomGetFactMessage + fact;
                var repromptSpeech = randomPhrase(this.t("GET_REPROMPT_MESSAGE"));
                this.emit(':askWithCard', speechOutput, repromptSpeech, this.t("SKILL_NAME"), fact)
            }
        }else{
            //Provide a random fact if the year is not found in the fact list
            this.emit('GetFact');
        }
    },
    
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

   
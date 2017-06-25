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
        // Get a random fact from the facts list
        // Use this.t() to get corresponding language data
        var factArr = this.t('FACTS');
        var randomFact = randomPhrase(factArr);
        var randomGetFactMessage = randomPhrase(this.t("GET_FACT_MESSAGE"))

        // Create speech output
        var speechOutput = randomGetFactMessage + randomFact;
        var repromptSpeech = randomPhrase(this.t("GET_REPROMPT_MESSAGE"));
        this.emit(':askWithCard', speechOutput, repromptSpeech, this.t("SKILL_NAME"), randomFact)
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
        var speechOutput = this.t("HELP_MESSAGE");
        var reprompt = this.t("HELP_MESSAGE");
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    }
};

function randomPhrase(phraseArr) {
    // returns a random phrase
    // where phraseArr is an array of string phrases
    var i = 0;
    i = Math.floor(Math.random() * phraseArr.length);
    return (phraseArr[i]);
};

function isAnswerSlotValid(intent) {
    var answerSlotFilled = intent && intent.slots && intent.slots.FACT_YEAR && intent.slots.FACT_YEAR.value;
    var answerSlotIsInt = answerSlotFilled && !isNaN(parseInt(intent.slots.FACT_YEAR.value));
    return answerSlotIsInt;
}
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

   
'use strict';

var _ = require('lodash');
var response = require('./response.json');

module.exports.handler = function(event, context) {

  var result = {
    "version": "1.0",
    "response": {
      "outputSpeech": {
        "type": "PlainText",
        "text": "Thank you. I'll post your gif now."
      },
      "reprompt": {
        "outputSpeech": {
          "type": "PlainText",
          "text": "Hmmm. I'd like to post your gif but I didn't catch that. Say it again?"
        }
      },
      "shouldEndSession": false
    },
    "sessionAttributes": {}
  };

  try {
    var keywords = event.body.request.intent.slots.Keywords.value;

    result.response.outputSpeech.text = keywords;

  }
  catch(e){
    result.response.outputSpeech.text = "Error. Error. Error.";
  }
  finally {
    return context.done(null, result);
  }

  //
  // console.log('\n\n\n------------------------');
  // console.log('event', JSON.stringify(event, 0, 2));
  // console.log('------------------------');
  // console.log('context', JSON.stringify(context, 0, 2));
  // console.log('------------------------\n\n\n');
  //
  // return context.done(null, response);
};

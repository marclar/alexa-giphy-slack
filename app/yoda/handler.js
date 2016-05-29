'use strict';

var _ = require('lodash');
var unirest = require('unirest');

module.exports.handler = function(event, context) {

  var result = {
    "version": "1.0",
    "response": {
      "outputSpeech": {
        "type": "PlainText",
        "text": "No result"
      },
      "reprompt": {
        "outputSpeech": {
          "type": "PlainText",
          "text": "Hmmm. I'd like to ask Yoda but I didn't catch that. Say it again?"
        }
      },
      "shouldEndSession": false
    },
    "sessionAttributes": {}
  };

  try {

    //Get search term
    var keywords = event.body.request.intent.slots.Keywords.value;

    // These code snippets use an open-source library. http://unirest.io/nodejs
    unirest.get("https://yoda.p.mashape.com/yoda?sentence="+encodeURIComponent(keywords))
        .header("X-Mashape-Key", process.env.MASHAPE_API_KEY)
        .header("Accept", "text/plain")
        .end(function (res) {

          console.log(res.status, res.headers, res.body);

          //End session
          result.response.shouldEndSession = true;

          //Send text
          result.response.outputSpeech.text = res.body;

          //Done!
          return context.done(null, result);

        });

  }
  catch(e){
    result.response.outputSpeech.text = "Error. Error. Error.";
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

'use strict';

var _ = require('lodash');
var giphy = require('giphy-api')();
var request = require('request');
var response = require('../response.json');

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

    //Get search term
    var keywords = event.body.request.intent.slots.Keywords.value;

    //Query Giphy API
    giphy.search(keywords, function(err, res) {
      if(err){
        console.log('err:', err);
        throw err;
      }
      else {

        //End session
        result.response.shouldEndSession = true;

        //If there's a result,
        var url = null;
        if(res.data && res.data.length){
          url = res.data[0].url;
        }

        //If there's a url,
        if(url){

          //Send to Slack
          var payload = {
            text: url
          };

          request.post(process.env.SLACK_WEBHOOK_URL, {body: JSON.stringify(payload)}, function(err){
            if(err){
              console.error('err sending to slack:', err);
              result.response.outputSpeech.text = "I'm sorry, but I had trouble sending that image to Slack.";
            }
            else{
              result.response.outputSpeech.text = "I've posted to Slack.";
            }

            //Done!
            return context.done(null, result);

          });

        }
        else {

          //No results
          result.response.outputSpeech.text = "I'm sorry, but I found no results for that phrase.";
          return context.done(null, result);

        }

      }
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

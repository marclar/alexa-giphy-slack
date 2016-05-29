'use strict';

var _ = require('lodash');
var unirest = require('unirest');

module.exports.handler = function(event, context) {

  var answers = [
      'It is certain',
      'It is decidedly so',
      'Without a doubt',
      'Yes, definitely',
      'You may rely on it',
      'As I see it, yes',
      'Most likely',
      'Outlook good',
      'Yes',
      'Signs point to yes',
      'Reply hazy. Try again',
      'Ask again later',
      'Better not tell you now',
      'Cannot predict now',
      'Concentrate and ask again',
      "Don't count on it",
      'My reply is no',
      'My sources say no',
      'Outlook not so good',
      'Very doubtful'
  ];

  var result = {
    "version": "1.0",
    "response": {
      "outputSpeech": {
        "type": "PlainText",
        "text": _(answers).chain().shuffle().pop()
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

    //Done!
    return context.done(null, result);

  }
  catch(e){
    result.response.outputSpeech.text = "Error. Error. Error.";
    return context.done(null, result);
  }

};

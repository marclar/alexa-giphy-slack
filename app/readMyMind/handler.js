'use strict';

var _ = require('lodash');

var suits = {
  "i know": "clubs",
  "im sure": "diamonds",
  "im thinking": "hearts",
  "im wondering": "spades"
};

var thirds = {
  "is thinking": [11, 12, 13, 14],
  "is looking": [6, 7, 8, 9, 10],
  "is holding": [2, 3, 4, 5]
};

var faces = {
  "am i right": 0,
  "i right": 0,
  "do you agree": 1,
  "you agree": 1,
  "do you know": 2,
  "you know": 2,
  "what do you think": 3,
  "do you think": 3,
  "you think": 3,
  "what is it": 4,
  "is it": 4
};

var names = [
    '',
    '',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'jack',
    'queen',
    'king',
    'ace'
];

var result = {
  "version": "1.0",
  "response": {
    "outputSpeech": {
      "type": "PlainText",
      "text": ""
    },
    "reprompt": {
      "outputSpeech": {
        "type": "PlainText",
        "text": "Hmmm. I'd like to tell you but I didn't catch that. Say it again?"
      }
    },
    "shouldEndSession": false
  },
  "sessionAttributes": {}
};


module.exports.handler = function(event, context) {

  try {

    var intent = event.body.request.intent;

    //Get the normalized answers
    var suit = (intent.slots.Statement.value || '').replace(/[^A-Za-z0-9\s]/g,"").replace(/\s{2,}/g, " ").toLowerCase();
    var third = (intent.slots.Third.value || '').replace(/[^A-Za-z0-9\s]/g,"").replace(/\s{2,}/g, " ").toLowerCase();
    var face = (intent.slots.Question.value || '').replace(/[^A-Za-z0-9\s]/g,"").replace(/\s{2,}/g, " ").toLowerCase();

    //Take the first couple of words in case there were extras
    suit = suit.split(' ').slice(0, 2).join(' ');
    third = third.split(' ').slice(0, 2).join(' ');

    //Keep a record of the answers for later use
    var answers = JSON.parse(JSON.stringify({suit: suit, third: third, face: face}));

    //Get values from map
    suit = suits[suit];
    third = thirds[third];
    face = third[faces[face]];

    //Create the sentence
    var sentence = '';
    switch(answers.face){
      case 'am i right':
          sentence = _([
            '', '', '',
            '', '', '',
            '', '', '',
            'You\'re right!',
            'Yes, you\'re right.',
            'You\'re always right.'
          ]).chain().shuffle().pop();
        break;
      case 'do you agree':
        sentence = _([
          '', '', '',
          '', '', '',
          '', '', '',
          'I do agree.',
          'Yes, I agree.',
          'Of course I agree.'
        ]).chain().shuffle().pop();
        break;
      case 'do you know':
        sentence = _([
          '', '', '',
          '', '', '',
          '', '', '',
          'Yes.',
          'Yes, I know.',
          'I know.'
        ]).chain().shuffle().pop();
        break;
      case 'what do you think':
        sentence = _([
          '', '', '',
          '', '', '',
          '', '', '',
          'You know what I think.',
          'Good question. I think that',
          'Hmmmm. I think that'
        ]).chain().shuffle().pop();
        break;
      case 'what is it':
        sentence = _([
          '', '', '',
          '', '', '',
          '', '', '',
          'I know you\'re aware, but',
          'You already know, but I\'ll play along.',
        ]).chain().shuffle().pop();
        break;
    }

    //Add the card details,
    sentence += ' the card is the ' + names[face] + ' of ' + suit + '.';

    result.response.outputSpeech.text = sentence;

    console.log('inputs & results: ', {answers: answers, suit: suit, third: third, face: face, sentence: sentence});

    //UNLESS!!
    // if anything was undefined,
    if(!sentence || sentence.indexOf('undefined') > -1){
      result.response.outputSpeech.text = _([
        "I wish I could tell you, but our psychic connection seems a bit shaky. Unless you're being a joker.",
        "Either you are, or the card is, a joker."
      ]).chain().shuffle().pop();
    }

    //Done!
    return context.done(null, result);

  }
  catch(e){
    console.error('Error:', e.toString(), e);
    result.response.outputSpeech.text = "Error. Error. Error.";
    return context.done(null, result);
  }

};

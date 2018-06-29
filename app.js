const { createMachine } = require('@xmachina/message');
const http = require('http');
const { PORT = 3000 } = process.env;
const util = require('util');

http.createServer(async (req, res) => {
  let body = '';

  req.on('data', (data) => {
    body += data;
  });

  req.on('end', async () => {
    try {
      const reply = await main(JSON.parse(body));
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(reply));
    } catch (error) {
      console.log(error);
      res.writeHead(500, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(error));
    }
    res.end();
  });
  
}).listen(PORT);

async function main(obj) {
  return new Promise (function(resolve, reject) {
    try {
      let result = {};
  
      // initialize object for interrogating input.
      const machine = createMachine();
      machine.updateWorkObj(obj);
  
      // grab a copy of the validated data object
      const args = machine.getWorkObj();
  
      // begin to construct the response object
      result.sender = args.message.From;
      result.orgmessage = args;
      result.reply = [];
  
      getMessage(args, (response) => {
        result.reply = response.slice();
        machine.setResponse(result);
        let newObj = machine.getWorkObj();
        resolve(newObj);
      });
    } catch (error) {
      reject(error);
    }
  });
}

const getMessage = (args, cb) => {
  const response = [];
  const phrases = [];

  // send responses in separate objects.
  const msgLink = {};
  const msgPhrase = {};

  switch(args.classifier.topclass.toLowerCase()) {
    case 'music':
      phrases.push('He is faithful!');
      phrases.push('Our God is forever faithful!');
      phrases.push('Worship our Lord!');
      phrases.push('Enjoy!');
      msgLink.link = 'http://bit.ly/2CWpxCb';
      break;
    case 'message':
      phrases.push('here is the link to our sermon series');
      msgLink.link = 'http://mercycharlotte.com/resources/all-series/';
      break;
    case 'banter':
      phrases.push('Hello! Welcome to Mercy Mobile');
      phrases.push('Hi. We\'re delighted you\'re here. Check out our lastest sermon series. Or text worship for a song');
      phrases.push('Thank you for texting us at Mercy Church. You can ask for a sermon, music, directions --');
      break;
    case 'help':
    case 'support':
    case 'prayer':
    case 'weather': 
    case 'cg':
    case 'events':
    case 'children':
    case 'students':
    case 'college':
    case 'giving':
      phrases.push('Thank you for your text. Our messaging platform is only responding to a limited number of queries at this time');
      break;
    case 'times':
      phrases.push('Our worship services are held at 9am and 11 am on Sunday, at the Levine Center in Matthews');
      msgLink.link = 'http://mercycharlotte.com/about/worshipservices/';
      break;
    case 'location':
      phrases.push('We hope to see you at Mercy Church. Check out the link for our location');
      phrases.push('Mercy Church meets in Matthews. Here is a link to find us!');
      phrases.push('We meet at the Levine Center in Matthews. Here is a google map for your reference');
      msgLink.link = 'http://bit.ly/2wAUDeR';
      break;
    case 'mission':
      phrases.push('Thank you for your interest in serving. Please reference the attached link for short term mission trips');
      msgLink.link = 'https://bit.ly/2qLtvd4';
      break;
    case 'beliefs':
      phrases.push('Please contact a member of our pastoral team if you have any additional questions about Mercy Church or our beliefs');
      msgLink.link = 'http://mercycharlotte.com/about/beliefs/';
      break;
    case 'registerstartingpoint':
      phrases.push('Thank you for your interest in StartingPoint. We look forward to seeing you there!  Please RSVP by clicking on the attached link!');
      msgLink.link = 'http://bit.ly/2B5hoKn';
      break;
    case 'whatisstartingpoint':
      phrases.push('Starting Point is your opportunity to learn more about the Mercy Community!');
      msgLink.link = 'http://bit.ly/2CyOPad';
      break;
    case 'whenisstartingpoint':
      phrases.push('Starting Point is held nearly every month. We hope to see you at the next one!');
      break;
    case 'whereisstartingpoint':
      phrases.push('Starting Point will be held at the Levine Senior Center');
      msgLink.link = 'http://bit.ly/2wAUDeR';
      break;
    case 'childcarestartingpoint':
      phrases.push('Yes. Childcare is provided at starting point but you will need to register when open');
      break;
    case 'worship':
      phrases.push('Here is the link to the Mercy playlist on Spotify');
      msgLink.link = 'http://spoti.fi/2FJ14SQ';
      break;
    case 'membership':
      phrases.push('Join us for Starting Point Weekend to learn more getting involved with the Mercy Community!');
      msgLink.link = 'http://bit.ly/2CyOPad';
      break;
    case 'member':
      phrases.push('Great! Do you need childcare for that evening?');
      break;
    case 'decline':
      phrases.push('We\'re sorry you cannot join us for member night!');
      break;
    case 'memberchild':
      phrases.push('Tap the link to register for child care on member night');
      msgLink.link = 'http://bit.ly/2B5M79Y';
      break;
    case 'close':
      phrases.push('Thanks!');
      break;
    case 'easter':
      phrases.push('Easter begins our new series: "Getting Started". Check out the link!');
      phrases.push('We so look forward to seeing you on Easter. Be sure to invite a friend!');
      phrases.push('See you on Easter Sunday! Our new series will be exciting!');
      phrases.push('Let\'s worship our risen Lord on Easter! Check out the link for our new series!');
      phrases.push('Easter will be a glorious day of celebration! Bring a friend!');
      msgLink.link = 'http://mercycharlotte.com/easter/';
      break;
    case 'music2':
      phrases.push('He\'s alive! Enjoy the newest single from Mercy Worship.');
      msgLink.link = 'https://bit.ly/2GKg8TH';
      break;
    case 'serveweek':
      phrases.push('Enjoy serving our city! Please tap the link to sign up!');
      msgLink.link = 'https://bit.ly/2FFCz7V';
      break;
    default:
      phrases.push('I did not understand your request. Please contact support.');
      break;
  }
  msgPhrase.phrase = phrases[getRandomInt(phrases.length - 1)];
  response.push(msgPhrase);
  response.push(msgLink);
  cb(response);
};

// Retrieve random number from 0 to max.
const getRandomInt = (max) => {
  return Math.floor(Math.random() * (max + 1));
};

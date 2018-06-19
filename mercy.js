const { createMachine } = require('@xmachina/message');
const http = require('http');
const { PORT = 3000 } = process.env;

const machine = createMachine();

http.createServer(async (req, res) => {
  let body = '';

  req.on('data', (data) => {
    body += data;
  });

  req.on('end', async () => {
    const reply = await main(JSON.parse(body));
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(reply));
    res.end();
  });
  
}).listen(PORT);


function main(obj) {
  return new Promise (function(resolve, reject){
          let result = {};
          console.log("---------AWS----------")

          machine
            .then((o) => {        
              o.updateWorkObj(obj);
              // grab a copy of the validated data object
              const args = o.getWorkObj();
              // begin to construct the response object
              result.sender = args.message.From
              result.orgmessage = args
              // get the agent response
              result.reply = [];
              o.setWatsonClassification(args.classifier.orgclassification);

              getMessage(args, (response) => {
                result.reply = response.slice()
                  o.setAgentReply(result)
                  let newObj = o.getWorkObj()
                  resolve(newObj)
              });

            })
             .catch((e) => {
                console.log("Experiment failed")
                console.log(e)
                reject(e)
          })
    })
  }

const getMessage = (args, cb) => {
  const response = [];
  const phrases = [];
  const msg = {};

  switch(args.classifier.topclass.toLowerCase()) {
    case 'music':
      phrases.push('He is faithful!');
      phrases.push('Our God is forever faithful!');
      phrases.push('Worship our Lord!');
      phrases.push('Enjoy!');
      msg.link = 'http://bit.ly/2CWpxCb';
      break;
    case 'message':
      phrases.push('here is the link to our sermon series');
      msg.link = 'http://mercycharlotte.com/resources/all-series/';
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
      msg.link = 'http://mercycharlotte.com/about/worshipservices/';
      break;
    case 'location':
      phrases.push('We hope to see you at Mercy Church. Check out the link for our location');
      phrases.push('Mercy Church meets in Matthews. Here is a link to find us!');
      phrases.push('We meet at the Levine Center in Matthews. Here is a google map for your reference');
      msg.link = 'http://bit.ly/2wAUDeR';
      break;
    case 'mission':
      phrases.push('Thank you for your interest in serving. Please reference the attached link for short term mission trips');
      msg.link = 'https://bit.ly/2qLtvd4';
      break;
    case 'beliefs':
      phrases.push('Please contact a member of our pastoral team if you have any additional questions about Mercy Church or our beliefs');
      msg.link = 'http://mercycharlotte.com/about/beliefs/';
      break;
    case 'registerstartingpoint':
      phrases.push('Thank you for your interest in StartingPoint. We look forward to seeing you there!  Please RSVP by clicking on the attached link!');
      msg.link = 'http://bit.ly/2B5hoKn';
      break;
    case 'whatisstartingpoint':
      phrases.push('Starting Point is your opportunity to learn more about the Mercy Community!');
      msg.link = 'http://bit.ly/2CyOPad';
      break;
    case 'whenisstartingpoint':
      phrases.push('Starting Point is held nearly every month. We hope to see you at the next one!');
      break;
    case 'whereisstartingpoint':
      phrases.push('Starting Point will be held at the Levine Senior Center');
      msg.link = 'http://bit.ly/2wAUDeR';
      break;
    case 'childcarestartingpoint':
      phrases.push('Yes. Childcare is provided at starting point but you will need to register when open');
      break;
    case 'worship':
      phrases.push('Here is the link to the Mercy playlist on Spotify');
      msg.link = 'http://spoti.fi/2FJ14SQ';
      break;
    case 'membership':
      phrases.push('Join us for Starting Point Weekend to learn more getting involved with the Mercy Community!');
      msg.link = 'http://bit.ly/2CyOPad';
      break;
    case 'member':
      phrases.push('Great! Do you need childcare for that evening?');
      break;
    case 'decline':
      phrases.push('We\'re sorry you cannot join us for member night!');
      break;
    case 'memberchild':
      phrases.push('Tap the link to register for child care on member night');
      msg.link = 'http://bit.ly/2B5M79Y';
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
      msg.link = 'http://mercycharlotte.com/easter/';
      break;
    case 'music2':
      phrases.push('He\'s alive! Enjoy the newest single from Mercy Worship.');
      msg.link = 'https://bit.ly/2GKg8TH';
      break;
    case 'serveweek':
      phrases.push('Enjoy serving our city! Please tap the link to sign up!');
      msg.link = 'https://bit.ly/2FFCz7V';
      break;
    default:
      phrases.push('I did not understand your request. Please contact support.');
      break;
  }
  msg.msg = phrases[getRandomInt(phrases.length - 1)];
  response.push(msg);
  cb(response);
};

// Retrieve random number from 0 to max.
const getRandomInt = (max) => {
  return Math.floor(Math.random() * (max + 1));
};

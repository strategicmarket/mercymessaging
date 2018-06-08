// const greeting =              require('greeting');
// const request =               require('request-promise');
const { machine } = require('./constructor');
const http = require('http');

const { PORT = 3000 } = process.env;

http.createServer(async (req, res) => {
  let body = '';

  req.on('data', (data) => {
    body += data;
  });

  req.on('end', async () => {
    const x = await main(JSON.parse(body));
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(x));
    res.end();
  });
  
}).listen(PORT);


function main(obj) {
  return new Promise (function(resolve, reject){
          let result = {};
          console.log("---------AWS----------")

          machine()
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

  console.log(args.classifier.topclass);
  switch(args.classifier.topclass) {
    case 'music':
      phrases.push('He is faithful!');
      phrases.push('Our God is forever faithful!');
      msg.link = 'http://bit.ly/2CWpxCb';
      break;
    case 'message':
      phrases.push('here is the link to our sermon series');
      msg.link = 'http://mercycharlotte.com/resources/all-series/';
      break;
    default:
      phrases.push('I did not understand your request. Please contact support.');
      break;
  }
  msg.msg = phrases[getRandomInt(phrases.length - 1)];
  response.push(msg);
  cb(response);
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * (max + 1));
}

exports.handler = main;

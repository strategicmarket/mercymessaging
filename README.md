## Mercy Church Messaging Service
Mercy Church messaging service deployed to an AWS lambda instance using Apex.sh tool "up".

##Getting Set Up

Getting the app running on your local machine takes only a few steps:

1. clone the project - `git clone https://github.com/strategicmarket/mercymessaging.git
2. install the 'up' CLI tool - https://up.docs.apex.sh/
3. install the project dependencies - npm install
4. start the app - up start

##Testing The Service

Once the app is running, simply make an HTTP POST to localhost:$PORT with the dataobject.json file in the examples directory. The service keys off of the classifier.topclass property on the JSON object. Changing this will alter the message returned in the response property of the JSON reply.
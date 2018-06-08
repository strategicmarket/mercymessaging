
//////////////////////////////////////////////////////////////////////////
//////////                   http calls                     /////////////
////////////////////////////////////////////////////////////////////////

const request =       require('request')
// const config =        require('../config').init()

const apiProfile = process.env.CHAOTICSMS_URL; // || config.chaoticsms.url

let localStorage = {
  token: ""
}
// Generate a unique token for storing your data on backend server.
let token = localStorage.token

if (!token) {
  token = localStorage.token = Math.random().toString(36).substr(-8)
 }

let headers = {
  'Accept': 'application/json',
  'Authorization': token
 }

//////////////////////////////////////////////////////////////////////////
////////////////////    execute an http call         ////////////////////
////////////////////////////////////////////////////////////////////////

// cloud functions residing on microservices platforms like ow, aws, google
// note in post request, 'json' is a key word -- as well as 'form'
// ie {json: { key: value }}
  exports.getAgentResponse = (apiparm) => {  
       return new Promise((resolve, reject) => {
         request.post(
              apiparm.url,
              { json: apiparm.body },
              function (error, response, body) {
                if (error) {
                    console.log("Error encountered in microservices http call - getAgentResponse")
                    console.log(error)
                    reject(error)}
                resolve(body)
          });
       })
     }

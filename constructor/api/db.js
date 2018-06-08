
////////////////////////////////////////////////////////
/////////////   mongo db functions        /////////////
//////////////////////////////////////////////////////

const interactObj =     require("../schemas/Interact")
const agentObj  =       require('../schemas/Agent')
const clientObj =       require('../schemas/Client')
const memberObj =       require('../schemas/Member')

    //////////////////////////////////////////////////////
    //////        interaction collection           //////
    ////////////////////////////////////////////////////

// hold the interact connection  -- REFACTOR -- to preserve compiled model between
// finding last interaction and recording the next interaction -- then close after recording

  exports.saveInt = (obj, conn) => {

    // test to see if model previously compiled for another stage. Error if does not exist
    let Interact
      try {
        Interact = conn.model('Interact')
      } catch (error) {
        Interact = conn.model('Interact', interactObj.interactSchema);
      }

    Interact.create(obj).then(function(doc) {
        // do nothing
      }).catch(function(err) {
          console.log(err)
      });
    }

    // this function returns the last interaction in db based on date and time
    // note that mongoose find returns [] if no record found. Return original record - which is an object

  exports.findLastInteraction = (obj, conn) => {
    // test to see if model previously compiled for another stage  -- error if does not exist
    let Interact
      try {
        Interact = conn.model('Interact')
      } catch (error) {
        Interact = conn.model('Interact', interactObj.interactSchema);
      }

      // note the logic here. Find all messages in the interact collection in the
      // client database that were from this user. Sort in postdate to return the last one

    return new Promise((resolve, reject) => {
      Interact.find({ 'message.From': obj.message.From})
            .sort({'postdate': -1})
            .limit(1)
            .exec(function (err, record) {
              if (err) reject(err);

              if (record.length == 0) {
                resolve(null)
              } else {
                resolve(record[0])
              }
      })
    })
  }


      //////////////////////////////////////////////////////
      //////           agent collection              //////
      ////////////////////////////////////////////////////

  exports.findAgent = (obj, conn) => {

    let Agent
      try {
        Agent = conn.model('Agent')
      } catch (error) {
        console.log(error)
        Agent = conn.model('Agent', agentObj.agentSchema);
      }

      return new Promise((resolve, reject) => {
        Agent.find({name: obj.machine.name}, function(err, response) {
          if (err) {
            if (err.error !== 'not_found') {
              resolve(err)
            } else {
              reject(err)
            }};
          resolve(response);
        });
      })
    }

  exports.getAgent = (conn) => {
    let Agent
      try {
        Agent = conn.model('Agent')
      } catch (error) {
        Agent = conn.model('Agent', agentObj.agentSchema);
      }

    return new Promise((resolve, reject) => {
      Agent.find({}, function(err, response) {
          if (err) {
            if (err.error !== 'not_found') {
              resolve(err)
            } else {
              reject(err)
            }};
          resolve(response);
        });
       })
     }

  exports.putAgent = (params, conn) => {
    let Agent
      try {
        Agent = conn.model('Agent')
      } catch (error) {
        Agent = conn.model('Agent', agentObj.agentSchema);
      }

    agent = new Agent(params);
    return new Promise((resolve, reject) => {
        agent.save(function (err, response) {
          if (err) {
            console.log("Error When Saving Agent")
            reject(err)
          }
          resolve(response)
    })
   })
  }

  exports.updateAgent = (contact, conn) => {
    let Agent
      try {
        Agent = conn.model('Agent')
      } catch (error) {
        Agent = conn.model('Agent', agentObj.agentSchema);
      }

    return new Promise((resolve, reject) => {
    Agent.findOneAndUpdate({id: contact.id}, contact, {upsert: true}, function (err, response) {
      if (err) {
        console.log(r("Error When Updating Agent"))
        reject(err)
      }
      resolve(response);
      })
    })
  }

  exports.deleteAgent = (id, conn) => {
    let Agent
      try {
        Agent = conn.model('Agent')
      } catch (error) {
        Agent = conn.model('Agent', agentObj.agentSchema);
      }

    return new Promise((resolve, reject) => {
      Agent.remove({id: id}, function(err, response) {
          if (err) {
            if (err.error !== 'not_found') {
              resolve(err)
            } else {
              reject(err)
            }};
          resolve(response);
        });
      })
    }
    // A mongoose pattern for a more sophisticated search
    // Retrieve users from db in the same geographic area as the active user.
    // The param being passed has context and user id  properties set to
    // current active user. But note that this search excludes the active user
    // from the search results
  /*
    fetch: function(params, callback) {

        botdb.find({ $and: [ {'context.longitude': {$eq: params.context.longitude} },
                             {'context.latitude': {$eq: params.context.latitude} },
                             {'userID': {$ne: params.user} } ] },
                function(err, results) {

                  return callback(err, results);
                });


      }
  */
      //////////////////////////////////////////////////////
      //////          client collection              //////
      ////////////////////////////////////////////////////

  exports.getClients = (conn) => {

    let Client
      try {
        Client = conn.model('Client')
      } catch (error) {
        Client = conn.model('Client', clientObj.clientSchema);
      }

    return new Promise((resolve, reject) => {
      Client.find({}, function(err, response) {
          if (err) {
            if (err.error !== 'not_found') {
              resolve(err)
            } else {
              reject(err)
            }};
          resolve(response);
        });
      })
    }

  exports.putClient = (params) => {
    let Client
      try {
        Client = conn.model('Client')
      } catch (error) {
        Client = conn.model('Client', clientObj.clientSchema);
      }

    let client = new Client(params);
    return new Promise((resolve, reject) => {
        client.save(function (err, response) {
          if (err) {
            console.log("Error When Saving Client Roster")
            reject(err)
          }
          resolve(response)
     })
   })
  }

  exports.updateClient = (contact, conn) => {
    let Client
      try {
        Client = conn.model('Client')
      } catch (error) {
        Client = conn.model('Client', clientObj.clientSchema);
      }

    return new Promise((resolve, reject) => {
    Client.findOneAndUpdate({id: contact.id}, contact, function (err, response) {
      if (err) {
        console.log(r("Error When Updating Client"))
        reject(err)
      }
      resolve(response);
      })
    })
  }

  exports.deleteClient = (id, conn) => {
    let Client
      try {
        Client = conn.model('Client')
      } catch (error) {
        Client = conn.model('Client', clientObj.clientSchema);
      }
    return new Promise((resolve, reject) => {
      Client.remove({id: id}, function(err, response) {
          if (err) {
            if (err.error !== 'not_found') {
              resolve(err)
            } else {
              reject(err)
            }};
          resolve(response);
        });
      })
    }

//
//////////////////////////////////////////////////////
//////         member collection              //////
////////////////////////////////////////////////////
exports.findMember = (obj, conn) => {
let Member
try {
  Member = conn.model('Member')
} catch (error) {
  Member = conn.model('Member', memberObj.memberSchema);
}

return new Promise((resolve, reject) => {
  Member.find({cell: obj.message.From}, function(err, response) {
    if (err) {
      if (err.error !== 'not_found') {
        resolve(err)
      } else {
        reject(err)
      }};
    resolve(response);
  });
})
}

exports.putMember = (params) => {

let Member
  try {
    Member = conn.model('Member')
  } catch (error) {
    Member = conn.model('Member', memberObj.memberSchema);
  }

let member = new Member(params);
return new Promise((resolve, reject) => {
  member.save(function (err, response) {
    if (err) {
      console.log("Error When Saving Client Roster")
      reject(err)
    }
    resolve(response)
})
})
}

exports.updateClient = (contact, conn) => {
  let Member
    try {
      Member = conn.model('Member')
    } catch (error) {
      Member = conn.model('Member', memberObj.memberSchema);
    }

return new Promise((resolve, reject) => {
Member.findOneAndUpdate({id: contact.id}, contact, function (err, response) {
if (err) {
  console.log(r("Error When Updating Member"))
  reject(err)
}
resolve(response);
})
})
}

exports.deleteMember = (id, conn) => {
  let Member
    try {
      Member = conn.model('Member')
    } catch (error) {
      Member = conn.model('Member', memberObj.memberSchema);
    }
return new Promise((resolve, reject) => {
Member.remove({id: id}, function(err, response) {
    if (err) {
      if (err.error !== 'not_found') {
        resolve(err)
      } else {
        reject(err)
      }};
    resolve(response);
  });
})
}

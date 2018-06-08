// repository.js
'use strict'
///////////////////////////////////////////////////////////////////
////////////             Strategic Machines          /////////////
///////////         machine constructor    c2017    //////////////
/////////////////////////////////////////////////////////////////
const Classifier =            require('watson-developer-cloud/natural-language-classifier/v1')
const clone =                 require('clone-deep')
const dayjs =                 require('dayjs')
// const errMsg =                require('./config').error()
const db =                    require('./api/db')
const http =                  require('./api/http')
const {isNull} =              require('./utils')
const { g, b, gr, r, y } =    require('./console')

// factory function, that holds an open connection to the db,
// and exposes function for low latency message processing

const repository = () => {

  // workobject is updated by stage
  let workObj = {}

  // db connection - based on customer api
  let conn = {}

  //////////////////////////////////////////////////////
  //////          Watson SDK                     //////
  ////////////////////////////////////////////////////

    // REFACTOR - test for failed conditions - unable to retrieve classifier
    const classifyMessage = () => {

      const classifier = new Classifier({
        username: workObj.config.watsonclassifier.username,
        password: workObj.config.watsonclassifier.password
      });

      return new Promise((resolve, reject) => {
        classifier.classify({
          text: workObj.message.Body,
          classifier_id: workObj.config.watsonclassifier.classifier1 },
          function(err, response) {
            if (err) reject(err)
            resolve(response)
            })
          })
        }

  ////////////////////////////////////////
  /////   Members                 ///////
  //////////////////////////////////////
  const findMember = () => {
    let obj = workObj
    return new Promise((resolve, reject) => {
      resolve(db.findMember(obj, conn))
      })
    }

  ////////////////////////////////////////
  /////   Interactions            ///////
  //////////////////////////////////////
  const findLastInteraction = () => {
    let obj = clone(workObj)
    return new Promise((resolve, reject) => {
      resolve(db.findLastInteraction(obj, conn))
      })
    }
  ////////////////////////////////////////
  /////   Agents                 ////////
  //////////////////////////////////////

  // test url: 'https://openwhisk.ng.bluemix.net/api/v1/web/patrick.howard@hotmail.com_dev/default/sm_test.json',
  const getAgentReply = () => {
    let obj = workObj
    let apiparm = { url: getCurrentAgentSkill(),
                    body: obj,
                    headers: { "Content-Type": "application/json" } };
    //
    return new Promise((resolve, reject) => {
      resolve(http.getAgentResponse(apiparm))
    })
  }

  //dynamic connect and search of agent collectionfor that client
  const findAgent = () => {
    let obj = workObj
    return new Promise((resolve, reject) => {
      resolve(db.findAgent(obj, conn))
      })
    }

  ////////////////////////////////////////
  /////   workObject functons     ///////
  //////////////////////////////////////
  const updateWorkObj = (obj) => {
    workObj = { ...workObj, ...obj }
    return
  }

  const setModelObj = (obj) => {
    workObj = clone(obj)                // make a copy without protypal reference
    return
  }

  const getWorkObj = () => {
    let copyObj = clone(workObj)
    return copyObj
  }

  const getStatus = () => {
    return workObj.status
  }

  const getConfidenceThreshold = () => {
    return workObj.config.runparms.confidenceLevel
  }

  const getMeter = () => {
    return workObj.meter
  }

  const setMeter = (obj) => {
    workObj.meter.push(obj)
    return
  }
  const updateMeter = (resp) => {
    workObj.meter = resp
    return
  }
  const setReply = (resp) => {
    workObj.response.reply.push(resp)
    return
  }
  // merge agent replies with any system replies that may have been captured
  const setAgentReply = (resp) => {
    workObj.response.sender = resp.sender
    workObj.response.orgmessage = resp.orgmessage
    workObj.response.reply = [...workObj.response.reply, ...resp.reply]
    return
  }

  const setWatsonClassification = (response) => {
     // create classifier object -- to merge with workobj
     // note this is a one time merge -- overlaying all prior data
     let newObj = {}
     newObj.classifier = {}
     let percent

     // capture confidence level from response for the top intent identified
     let newarray = response.classes.filter((r) => r.class_name == response.top_class )
     newObj.classifier.confidence = Math.round(newarray[0].confidence * 100) / 100

     percent = newObj.classifier.confidence * 100;
     percent = percent + '%'
     newObj.classifier.percent = percent

     newObj.classifier.orgclassification = response
     newObj.classifier.topclass = response.top_class
     newObj.classifier.engine = "Watson"
     updateWorkObj(newObj)
     return
   }

   const getWatsonClassification = () => {
     return workObj.classifier
   }
   // add info selectively to machine -- use spread
   const setMachineState = (resp) => {
     workObj.machine = { ...workObj.machine, ...resp }
     return
   }
   const getMachineState = () => {
     return workObj.machine.thisState
   }
   // replace embedded object
   const setAgent = (resp) => {
     let newObj = {}
     newObj.agent = resp
     updateWorkObj(newObj)
     return
   }

   const getCurrentAgentSkill = () => {
     let i = workObj.machine.thisSlot             // position in the skill array for this interaction
     return workObj.agent.skills[i].skillsource
   }

   const setPostdate = (resp) => {
     let newObj = {}
     newObj.postdate = Date.now()
     updateWorkObj(newObj)           // post time stamp for message
     return
   }
   // save customer profile to workobj; not recorded in interact
   const setCustomer = (resp) => {
     let newObj = {}
     newObj.customer = resp
     updateWorkObj(newObj)
     return
   }
   // save config profile to workobj; not recorded in interact
   const setConfig = (resp) => {
     let newObj = {}
     newObj.config = resp
     updateWorkObj(newObj)
     return
   }
   const setMember = (resp) => {
     let newObj = {}
     newObj.member = resp
     updateWorkObj(newObj)           // object with member data appended to workobject
     return
   }
   const setMessage = (resp) => {
     let newObj = {}
     newObj.message = resp
     updateWorkObj(newObj)           // object with message data appended to workobject
     return
   }
   //
   const incrementDialogue = (resp) => {
     let newObj = {}
     let newresponseObj = {}
     newresponseObj.priorinteract = resp.id    // capture id of last interaction
     newresponseObj.sequenceCnt = resp.dialogue.sequenceCnt + 1
     newObj.dialogue = newresponseObj
     updateWorkObj(newObj)                    // update dialogue object
   }
   const updateMachineState = (resp) => {
     let newObj = {}
     let newresponseObj = {}
     newresponseObj.thisSlot = resp.machine.thisSlot + 1  // increment pointer to next agent skill
     let i = newresponseObj.thisSlot
     newresponseObj.thisState = resp.agent.skills[i].skillname   // set next skill to execute
     newresponseObj.name = resp.agent.name
     newObj.machine = newresponseObj
     updateWorkObj(newObj)               // update machine object
   }

  ///////////////////////////////////////////////////
  /////   evaluate and set state of dialogue ///////
  /////////////////////////////////////////////////
  const setContext = (last) => {
    return new Promise((resolve, reject) => {

    // if no interaction was found
    if (isNull(last)) {
      console.log(r("setcontext --- step 1"))
      resetStatus()
      setNewDialogue()
      resolve(getStatus())
      return
    }

    if (last.status.isTerminated) {
      console.log(r("setcontext --- step 1 1/2"))
      resetStatus()
      setNewDialogue()
      resolve(getStatus())
      return
    }

    // evaluate elapse time since last interaction
    let elapseTime = dayjs().diff(last.postdate, "seconds")
    let expireInterval = workObj.config.runparms.expirationInterval

    if (elapseTime > expireInterval) {
      console.log(r("setcontext --- step 2"))
      resetStatus()
      setNewDialogue()
      resolve(getStatus())
      return
      }

    // thisSlot points to the array index -- when it equals array length we have no more skills to execute
    // Reset so intent of current text message is parsed as new interaction
    let nextSlot = last.machine.thisSlot + 1
    let endOfArray = last.agent.skills.length
    if (nextSlot == endOfArray) {
      console.log(r("setcontext --- step 3"))
      resetStatus()
      setNewDialogue()
      resolve(getStatus())
      return
      }

    // terminate process if runaway machine detected
    if (last.dialogue.sequenceCnt > workObj.config.runparms.machineIterationThrehold) {
      console.log(r("setcontext --- step 4"))
      let err = undefined; // errMsg.e940
      setError(err)
      resolve(getStatus())
      return
    }

    // terminate process if infinite loop detected - limit on number of iterations for a single agent
    let loop = last.meter.filter((meter) => meter.cnt > workObj.config.runparms.agentCallbackThreshold )
    if (loop.length > 0) {
      console.log(r("setcontext --- step 5"))
      let err = undefined; // errMsg.e920
      setError(err)
      resolve(getStatus())
      return
    }

    // agent requests a callback. Last skill executed will be executed again
    if (last.status.isCallback == true) {
      console.log(r("setcontext --- step 6"))
      updateWorkObj(last.machine)
      updateWorkObj(last.agent)
      updateWorkObj(last.meter)
      workObj.dialogue.priorInteract = lastInteraction.id
      workObj.dialogue.sequenceCnt++
      resetStatus()
      resolve(getStatus())
      return
    }

    // we know this is an active and existing dialogue
    console.log(r("setcontext --- step 7"))
    resetStatus()
    resolve(getStatus())
    return

   })

  }
  ////////////////////////////////////////
  /////   States > Workflow       ///////
  //////////////////////////////////////
  const resetStatus = () => {
    workObj.status.isNewInteraction = false
    workObj.status.isCallback = false
    workObj.status.isCallforward = false
    workObj.status.isTerminated = false
    workObj.status.ErrorMsg = undefined
    return
  }

  const setNewDialogue = () => {
    workObj.machine.name = undefined
    workObj.machine.thisState = undefined
    workObj.machine.thisSlot = undefined
    workObj.status.isNewInteraction = true
    workObj.dialogue.sequenceCnt = 1       // new dialogue with a new agent. Note default on dialogue schema
    return
  }

  const setError = (err) => {
    workObj.status.isNewInteraction = false
    workObj.status.isCallback = false
    workObj.status.isCallforward = false
    workObj.status.isTerminated = true
    workObj.status.ErrorMsg = err
    return
  }


  ////////////////////////////////////////
  /////   connection              ///////
  //////////////////////////////////////
  const setConnection = (connection) => {
    conn = connection

    conn.on('close', () => {
      console.log(b('connection closed...'))
    })

    return
    }

  const getConnection = () => {
      return conn
    }

  // this will close the database connection
  const disconnect = () => {
    conn.close()
  }
  //
  ////////////////////////////////////////////////////
  /////          export all functions         ///////
  //////////////////////////////////////////////////

  return Object.create({
    classifyMessage,
    disconnect,
    findAgent,
    findLastInteraction,
    findMember,
    getAgentReply,
    getConfidenceThreshold,
    getConnection,
    getCurrentAgentSkill,
    getMachineState,
    getMeter,
    getStatus,
    getWatsonClassification,
    getWorkObj,
    incrementDialogue,
    setAgent,
    setAgentReply,
    setConfig,
    setConnection,
    setContext,
    setCustomer,
    setError,
    setMachineState,
    setMember,
    setMessage,
    setMeter,
    setModelObj,
    setPostdate,
    setReply,
    setWatsonClassification,
    updateMachineState,
    updateMeter,
    updateWorkObj
    })
  }

const machine = () => {
  return new Promise((resolve, reject) => {

    resolve(repository())
  })
}

// the only exposed method of this module
module.exports = Object.assign({}, {machine})

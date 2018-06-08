
//////////////////////////////////////////////////////////////////////////
////////////////////    Uniform Response Schema     /////////////////////
////////////////////////////////////////////////////////////////////////

const mongoose = require("mongoose");
const uuidv1 =  require('uuid/v1')
const Schema = mongoose.Schema;

// refactor for required fields and validation routines
// for example, chaoticsource on the message object points to channel
// sms, web, fb, telegram, twitter ....
// NOTE - the global Objects are represented as strings vs primatives so stages/initialize.js
// can dynamically build a json schema and constructor for microservices calls

const interactObject = {
  message: {
    MessageSid: String,
    SmsSid: String,
    AccountSid: String,
    MessagingServiceSid: String,
    From: String,
    To: String,
    Body: String,
    NumMedia: String,
    NumSegments: String,
    MediaContentType: String,
    MediaUrl: String,
    FromCity: String,
    FromState: String,
    FromZip: String,
    FromCounty: String,
    SmsStatus: String,
    ToCity: String,
    ToState: String,
    ToZip: String,
    ToCountry: String,
    AddOns: String,
    ApiVersion: String,
    PostDate: { type: Date, default: Date.now() },
    ChaoticSid: { type: String, default: uuidv1() },
    ChaoticSource: String
  },
  member: {
    firstname: { type: String, default: "GUEST"},
    lastname: { type: String, default: "GUEST"},
    image: String,
    addr1: { type: String, default: "UNKNOWN"},
    addr2: { type: String, default: "UNKNOWN"},
    city: { type: String, default: "UNKNOWN"},
    state: { type: String, default: "UNKNOWN"},
    zip: { type: String, default: "UNKNOWN"},
    cell: { type: String, default: "UNKNOWN"},
    email: { type: String, default: "UNKNOWN"},
    network: { type: String, default: "UNKNOWN"},
    isAuthenticated: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    joindate: { type: Date, default: Date.now() },
    inactivedate: Date
  },
  machine: {
    name: { type: String, default: "UNKNOWN"},
    thisState: { type: String, default: "UNKNOWN"},
    thisSlot: Number,
    msg: { type: String, default: "NONE"},
    isValid: { type: Boolean, default: true }
  },
  agent: {
    name: {
      type: String,
      default: "UNKNOWN"    
    },
    avatar: String,
    greeting: String,
    priority: { type: Number, default: 1 },
    skills: [{
      skillname: String,
      skilltype: String,
      skillsource: String }],
    handle: String,
    handler: String,
    postdate: { type: Date, default: Date.now() },
    id: { type: String, default: uuidv1() }
  },
  classifier: {
    orgclassification: Object,
    confidence: Number,
    percent: String,
    topclass: String,
    engine: { type: String, default: "Watson"},
    },
  response: {
    sender: String,
    orgmessage: Object,
    reply: Array,
    machine: {
      name: { type: String, default: "UNKNOWN"},
      description: { type: String, default: "FUTURE - DYNAMIC ROUTING"},
      nextState: { type: String, default: "UNKNOWN"},
      msg: { type: String, default: "NONE"},
      isValid: { type: Boolean, default: true }
    },
    status: {
      isNewInteraction: { type: Boolean, default: false },
      isCallback: { type: Boolean, default: false },
      isCallforward: { type: Boolean, default: false },
      isTerminated: { type: Boolean, default: false },
      isAuthenticated: { type: Boolean, default: false },
      isAuthorized: { type: Boolean, default: false },
      ErrorMsg: Object
    },
    microgram: {
      micromessage: Object,
      isValid: { type: Boolean, default: true }
    }
  },
  status: {
    isNewInteraction: { type: Boolean, default: false },
    isCallback: { type: Boolean, default: false },
    isTerminated: { type: Boolean, default: false },
    isError: { type: Boolean, default: false },
    isAuthenticated: { type: Boolean, default: false },
    isAuthorized: { type: Boolean, default: false },
    ErrorMsg: Object
    },
  dialogue: {
    priorInteract: { type: String, default: "START"},
    sequenceCnt: { type: Number, default: 0}
    },
  meter: [{
    skill: String,
    cnt: Number }],
  org: String,
  postdate: { type: Date, default: Date.now() },
  id: { type: String, default: uuidv1() },
  v: {type: String, default: "0.8.0"}
}

const interactSchema = new Schema(interactObject, { collection: 'Interact' })

var Interact = mongoose.model("Interact", interactSchema);

module.exports = { Interact, interactSchema, interactObject }

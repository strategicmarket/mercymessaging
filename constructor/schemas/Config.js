'use strict';

const mongoose = require("mongoose");
const uuidv1 =  require('uuid/v1')

const Schema = mongoose.Schema;

const configObject = {  
  facebook: Object,
  twitter: Object,
  twilio: Object,
  email: Object,
  vmail: Object,
  slack: Object,
  redis: Object,
  watsonclassifier: Object,
  runparms: Object,
  postdate: { type: Date, default: Date.now },
  id: { type: String, default: uuidv1() }
}

const configSchema = new Schema(configObject, { collection: 'Config' });

var Config = mongoose.model("Config", configSchema);

module.exports = { Config, configSchema, configObject }

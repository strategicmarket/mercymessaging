'use strict';

const mongoose = require("mongoose");
const uuidv1 =  require('uuid/v1')

const Schema = mongoose.Schema;

const clientObject = {
  name: String,
  image: String,
  addr1: String,
  addr2: String,
  city: String,
  state: String,
  zip: String,
  contact: String,
  sms: String,
  web: String,
  email: String,
  dbname: String,
  urilocal: String,
  uri: String,
  username: String,
  password: String,
  isPrivate: { type: Boolean, default: true },
  isActivated: { type: Boolean, default: false },
  postdate: { type: Date, default: Date.now },
  id: { type: String, default: uuidv1() }
}

const clientSchema = new Schema(clientObject, { collection: 'Client' });

var Client = mongoose.model("Client", clientSchema);

module.exports = { Client, clientSchema, clientObject }

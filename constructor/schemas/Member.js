'use strict';

//////////////////////////////////////////////////////////////////////////
///////////////Partner Schema: Developers, Designers, SQE ///////////////
////////////////////////////////////////////////////////////////////////

const mongoose = require("mongoose");
const uuidv1 =  require('uuid/v1')
const Schema = mongoose.Schema;

// notes:
// refactor - areas to explore include capturing github auth data, auth via cell,
// management of workitems, payments data info
// need to identify some unique identifier for each partner

const memberObject = {
  firstname: String,
  lastname: String,
  image: String,
  addr1: String,
  addr2: String,
  city: String,
  state: String,
  zip: String,
  cell: String,
  email: String,
  network: String,
  isAuthenticated: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  joindate: { type: Date, default: Date.now() },
  inactivedate: Date,
  postdate: { type: Date, default: Date.now() },
  id: { type: String, default: uuidv1() }
}

const memberSchema = new Schema(memberObject, { collection: 'Member' });

var Member = mongoose.model("Member", memberSchema);

module.exports = { Member, memberSchema }

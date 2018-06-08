'use strict';

//////////////////////////////////////////////////////////////////////////
///////////////Partner Schema: Developers, Designers, SQE ///////////////
////////////////////////////////////////////////////////////////////////

const mongoose = require("mongoose");
const uuidv1 =  require('uuid/v1')
const Schema = mongoose.Schema;


// REFACTOR - EXPLORE MONGOOSE POPULATE TO SYNC WITH MEMBER COLLECTION

const partnerObject = {
  firstname: String,
  lastname: String,
  github: Object,
  competencies: Array,
  payments: Object,
  digitalRep: Object,
  workitems: {
    pending: Array,
    active: Array,
    completed: Array,
    archived: Array,
    abandoned: Array,
    escalations: Array
  },  
  ssn: String,
  joindate: { type: Date, default: Date.now },
  inactivedate: Date,
  postdate: { type: Date, default: Date.now },
  id: { type: String,
        default: uuidv1(),
        required: true}
}

const partnerSchema = new Schema(partnerObject, { collection: 'Partner' });

var Partner = mongoose.model("Partner", partnerSchema);

module.exports = { Partner, partnerSchema }

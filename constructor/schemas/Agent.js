'use strict';

const mongoose = require("mongoose");
const uuidv1 =  require('uuid/v1')

const Schema = mongoose.Schema;

const agentObject = {
    name: {
      type: String,
      unique: true,
      required: true
    },
    avatar: String,
    greeting: String,
    priority: { type: Number, default: 1 },
    skills: [ {
      skillname: String,
      skilltype: String,
      skillsource: String }
    ],
    handle: String,
    handler: String,
    postdate: { type: Date, default: Date.now },
    id: { type: String, default: uuidv1() }
}

const agentSchema = new Schema(agentObject, { collection: 'Agent' });

var Agent = mongoose.model("Agent", agentSchema);

module.exports = { Agent, agentSchema }

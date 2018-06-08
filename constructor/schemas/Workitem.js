
//////////////////////////////////////////////////////////////////////////
////////////////////        Workitems Schema        /////////////////////
////////////////////////////////////////////////////////////////////////

const mongoose = require("mongoose");
const uuidv1 =  require('uuid/v1')
const Schema = mongoose.Schema;

// notes: DISCUSS SCHEMA PROPERTIES - KEEP ONLY THOSE THAT ARE ESSENTIAL
// IS A DESCRIPTION SOMETHING WORTH STORING IN THE DB, CONSIDERING IT
// MIGHT CHANGE DRASTICALLY OVER TIME, AND COULD BE HANDLED ON GITHUB?
// MOREOVER, IT ISN'T EVEN DISLPAYED IN THE MARKETPLACE.

const workitemObject = {
  itemId: {
    type: String,
    trim: true,
    required: true
  },
  repo: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dueDate: Date,
  currency: String,
  stage: {
    type: String,
    validate: [
      function(i) {
        let validStages = ['pending', 'open', 'active', 'closed']
        let validated = validStages.find((v) => {return v == i})
        return validated != undefined
      },
      "Must be a valid stage"
    ],
    default: 'open'
  },
  assignee: {
    type: String,
    default: null
  },
  blockchain: {
    id: String,
    date: { type: Date, default: Date.now },
  },
  PostDate: { type: Date, default: Date.now },
  id: { type: String, default: uuidv1() }
}

const workitemSchema = new Schema(workitemObject, { collection: 'Workitem' });

var Workitem = mongoose.model("Workitem", workitemSchema);

module.exports = { Workitem, workitemSchema }

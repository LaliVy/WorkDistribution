var mongoose = require('mongoose');
const Schema = mongoose.Schema
var connection = require("../config/mongoose");
connection.getDbConnection();

let TasksSchema = new mongoose.Schema({
    priority:  { type: String},
    skills: Array,
    completed:  {type:Boolean, default:false},
    startTime: Date,
    agentName: String,
    agentID: {type: [Schema.Types.ObjectId]}
}, {timestamps: true });
module.exports = mongoose.model('Task', TasksSchema)
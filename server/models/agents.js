var mongoose = require('mongoose');
var connection = require("../config/mongoose");
const TasksSchema = require('./tasks').schema;
connection.getDbConnection();

var AgentsSchema = new mongoose.Schema({
    name: {type:String, required:true},
    skills: Array,
    taskCount: {type:Number, default:0},
    tasks: [TasksSchema],
    task_start_time: Date,
    hasHighPriorityTask: {type:Boolean, default:false}
}, {timestamps: true });
AgentsSchema.index({'_id': 1, 'name': 1}, {unique: true});
module.exports = mongoose.model('Agent', AgentsSchema)
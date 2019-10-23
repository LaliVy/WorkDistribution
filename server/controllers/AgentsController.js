const mongoose = require('mongoose');
const TasksSchema = require('../models/tasks')
const Task = mongoose.model('Task');
const AgentsSchema = require('../models/agents')
const Agent = mongoose.model('Agent');
module.exports = {
    /**
     * @create an agent 
     */
    createAgent: (req, res) => {
        console.log("AgentsController@ create agent...");
        let skillsArrayLower = req.body.skills.map(function(x){ return x.toLowerCase() })
        let newAgent = {
            name: req.body.name,
            skills: skillsArrayLower,
        }
        Agent.create(newAgent, (err, agentCreated) => {
            if (err) {
                res.json({ status: 'Error', message: 'Error while creating an agent.'});
                return;
            }
            else{  
                res.json({ status: 'Success', result: agentCreated, code:200 })                                  
            }
        })
    }
}
const mongoose = require('mongoose');
const TasksSchema = require('../models/tasks')
const Task = mongoose.model('Task');

const AgentssSchema = require('../models/agents')
const Agent = mongoose.model('Agent');
module.exports = {
    getTasks: function (req, res){
        Task.find({}, function(err, allTasks) {
        if(err) {
          console.log('something went wrong while retrieving tasks', err);
          res.json({ status: 'Error', message: 'something went wrong while retrieving tasks', code:400});
        } 
        else {  
            res.json({ status: 'Success', result: allTasks, code:200 })
        
        }
    })
},


    /**
     * @create create the task 
     */
    createTask: (req, res) => {
        let skillsArrayLower = req.body.skills.map(function(x){ return x.toLowerCase() })
        // Find agent with skills required to perform the task.
        Agent.find({ skills: {$all: skillsArrayLower}})
             .sort({taskCount: 'asc', task_start_time: 'desc'})
             .exec(function(err, agent){
                if (err) {
                    console.log("err in retrieving agents\n", err);
                    res.json({ status: 'Error', message: 'something went wrong while creating task', code:400});
                }
                else{                                    
                    // If the priority of the new task is 'LOW' and there are no agents free to perform the task, return
                    console.log("ERRROR.....", agent);
                    if(req.body.priority.toUpperCase() == 'LOW' && agent[0].taskCount > 0){
                        res.json({ status: 'Error', message: 'No agents to perform task', code:400});
                    }
                    // If the priority of the new task is 'HIGH' and no agents to perform the task as they are already working on higher priority task, return
                    else if(req.body.priority.toUpperCase() == 'HIGH' && agent[0].taskCount > 0 && agent[0].hasHighPriorityTask){
                        res.json({ status: 'Error', message: 'No agents to perform task', code:400});
                    }
                    // else create task
                    let newTask = {
                        priority: req.body.priority.toUpperCase(),
                        skills: req.body.skills,
                        completed: req.body.completed,
                        startTime: new Date(),
                        agentName: agent[0].name,
                        agentID: agent[0]._id
                    }
                    
                    Task.create(newTask, (err, taskCreated) => {
                        if (err) {
                            res.json({ status: 'Error', message: 'Error creating task', code:400});
                        }
                        else{  
                            // Check the priority of the task. If high update 
                            let highPriority = false;
                            let taskCount = agent[0].taskCount;
                            taskCount=taskCount+1
                            if(req.body.priority.toUpperCase() == 'HIGH')
                                highPriority = true;

                            // update the agent with created task
                            Agent.findByIdAndUpdate(
                                agent[0]._id,
                                {taskCount: taskCount, hasHighPriorityTask: highPriority, $push: {"tasks": taskCreated}},
                                {safe: true, upsert: true, new : true},
                                function(err, agentUpdated) {
                                    if(err){
                                        res.json({ status: 'Error', message: 'Error updating agent.', code:400});
                                    }
                                    else
                                        console.log('Successfully assigned the task to agent. ', agentUpdated);
                                }
                            ); 
                            res.json({ status: 'Success', result: taskCreated, code:200 })                                 
                        }
                    })
                }
            });
    },

    updateTask: function(req, res){
        console.log('updating the task.', req.body._id);
        isComplete = true;
        Task.findByIdAndUpdate(req.body._id, {"completed": isComplete}, 
        {safe: true, new:true},
        function(err, taskUpdated) {
          // if there is an error console.log that something went wrong!
          if(err) {
            console.log('something went wrong');
            res.json({ status: 'Error', error: err});
          } 
          else { 
            console.log('successfully updated task the task.', taskUpdated);
            // get the agent assinged to this task and delete the completed task from the tasks array
            Agent.findByIdAndUpdate(
                taskUpdated.agentID,
                {$pull: {tasks : {_id: taskUpdated._id}}, $inc:{taskCount: -1}},
                function(err, agentUpdated) {
                    if(err){
                        res.json({ status: 'Error', error: err});
                    }
                    else
                        console.log('Successfully deleted task from agent. ', agentUpdated);
                }
            );
            res.json({ status: 'Success', result: taskUpdated, code:200 })
          }   
        });
      
      },

      printError: function (req, res){
        res.setHeader('Content-Type', 'application/json');
        res.end(this.getJSONFormat(200, {'success': true}));
      },

      getJSONFormat: function(code_error, bodyResult){
        if (code_error === 400) {
            bodyResult = {
                'error': `${bodyResult} parameter is invalid`
            };
        }
        return `Body:\n${JSON.stringify(bodyResult, null, 2)}\nStatus: ${code_error}`;
    }
}
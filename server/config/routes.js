var TasksController = require("../controllers/TasksController");
var AgentsController = require("../controllers/AgentsController");
module.exports = function(app){
//  create a task
app.post("/task", function(req, res) {
  console.log('routes@ create task...');
  TasksController.createTask(req, res);
  });

//updatetask
app.put("/task", function(req, res) {
  console.log("routes@ update task...");
  TasksController.updateTask(req, res);
});

// get all tasks
app.get("/tasks", function(req, res) {
  console.log("routes@ get all tasks...");
  TasksController.getTasks(req, res);
});

// create an agent
app.post("/agent", function(req, res) {
  console.log("routes@ create agent...");
  AgentsController.createAgent(req, res);
});

app.get("/api/ping$", (req, res) => {
  TasksController.printError(req, res);

});



}
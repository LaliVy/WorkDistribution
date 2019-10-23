# WorkDistribution
Install mongodb
To start mongodb, run command, sudo mongod on the terminal
git clone https://github.com/LaliVy/WorkDistribution.git or download
cd WorkDistribution
Run npm init
nodemon server.js

Use POSTMAN to test the endpoints
HTTP Get - http://localhost:8000/tasks - View all tasks
HTTP POST - http://localhost:8000/agent - Creates agent
{
    "skills": ["skill1"],
    "name": "B"
}
HTTP POST - http://localhost:8000/task - Creates task
{
	"priority": "low",
	"skills": ["skill1"]
}
HTTP PUT - http://localhost:8000/task
{
	"_id": "5db0bda384d9f57a931b04ba",
	"completed": true
}




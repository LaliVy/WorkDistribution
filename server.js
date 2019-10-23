const express = require("express");
const app = express();
app.use(express.static( __dirname + '/Work-Dist-Angular-App/dist/Work-Dist-Angular-App' ));
app.use(express.json());
app.get('/', (request, response) => {
   response.send("Hello Express");
});
require('./server/config/routes.js')(app);
app.listen(8000, function() {
    console.log("listening on port 8000")
});

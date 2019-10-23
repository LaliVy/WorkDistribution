var mongoose = require('mongoose');

module.exports = {
    getDbConnection: function(){
        mongoose.connect('mongodb://localhost/work_dist_schema');
    }
}
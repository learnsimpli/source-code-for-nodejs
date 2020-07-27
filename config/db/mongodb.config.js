// Mongoose and MongoDB setup
const mongoose = require('mongoose');
const mongoDB = 'mongodb://localhost:27017/api2';
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.Promise = global.Promise;
module.exports = mongoose;
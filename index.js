// common files
const config = require('./config/global/global.config');
const apiLibray = require(`./${config.libraryPath}/api.library`),
    express = require('express'),
    logger = require('morgan'),
    movieRoutes = require(`./${config.routePath}/movie.route`),
    userRoutes = require(`./${config.routePath}/user.route`),
    bodyParser = require('body-parser'),
    mongoose = require(`./${config.dbPath}/mongodb.config`),
    app = express();

const routesDetails = require('./library/routes');
// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'Could not connect to the MongoDB...'));
mongoose.set('useCreateIndex', true);

// Log if development mode is true
if (config.development == true) {
    app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// API base
var APIPath = '/api/v/1';
// Routing for users model
app.use(APIPath+'/user', userRoutes);

// Routing for movies model
app.use(APIPath+'/movie', apiLibray.validateJwtToken, movieRoutes);


app.get('/', function(req, res) {
    let clientResponse=apiLibray.responseSuccess(true,200,'Welcome to REST API design tutorial...',routesDetails);
    res.json(
        clientResponse
    );
});

// handle 404 error
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// handle errors
app.use(function(err, req, res, next) {
    console.log(err);
    if (err.status === 404)
    {
        let clientResponse=apiLibray.responseSuccess(false,500,'Something is not working...');
        res.json(
            clientResponse
        );
    }
    else
    {
        let clientResponse=apiLibray.responseSuccess(false,500,'Something is not working...');
        res.json(
            clientResponse
        );
    }
        
});

app.listen(config.port, function() {
    console.log(`Node server listening on port ${config.port}`);
});
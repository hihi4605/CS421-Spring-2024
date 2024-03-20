var mongoose = require('mongoose');
var gracefulShutdown;

var dbURI = 'mongodb+srv://Chris:DrakeFan58949$@mydb.srmedx4.mongodb.net/';

mongoose.connect(dbURI);

console.log(mongoose.connection.readyState);  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting


// Monitor and report when database is connected                      
mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});

// Monitor and report error connecting to database
mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});

// Monitor and report when database is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
}); 
// Closes (disconnects) from Mongoose DB upon shutdown    
gracefulShutdown = function (msg, callback) {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};

// For nodemon restarts
process.once('SIGUSR2', function () {
  gracefulShutdown('nodemon restart', function () {
    process.kill(process.pid, 'SIGUSR2');
}); });

// For app termination
process.on('SIGINT', function() {
  gracefulShutdown('app termination', function () {
    process.exit(0);
}); });

// For Heroku app termination
process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app shutdown', function () {
    process.exit(0);
}); });

// Bring in Schemas and Models
require('./blog');
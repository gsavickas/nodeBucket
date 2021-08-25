/*
============================================
; Title:  nodebucket
; Author: Grayton Savickas
; Date:   18 Aug 2021
; Modified By:
; Description: App construction
;===========================================
*/

/**
 * Requirement statement and imports
 */
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');                        
const path = require('path');
const mongoose = require('mongoose');
const EmployeeAPI = require('./routes/employee.api');

/*
Some awesome feature
*/


/**
 * App configurations
 */
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': true}));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../dist/nodebucket')));
app.use('/', express.static(path.join(__dirname, '../dist/nodebucket')));

/**
 * Variables w/ optional default port and localhost 3000
 */
const port = process.env.PORT || 3000; // server port

//+ process.env.MongoPass +

const conn = 'mongodb+srv://dbUser-gss:KitchenSink1993@mando21.06wom.mongodb.net/nodebucket?retryWrites=true&w=majority';

/**
 * Database connection
 */
mongoose.connect(conn, {
  promiseLibrary: require('bluebird'),
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(() => {
  console.debug(`Connection to the database instance was successful`);
}).catch(err => {
  console.log(`MongoDB Error: ${err.message}`)
}); // end mongoose connection

/**
 * API(s) go here...
 */
app.use('/api/employees', EmployeeAPI);

/**
 * Create and start server
 */
http.createServer(app).listen(port, function() {
  console.log(`Application started and listening on port: ${port}`)
}); // end http create server function

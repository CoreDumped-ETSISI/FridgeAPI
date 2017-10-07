'use strict'

require('dotenv').config()
var mongoose = require('mongoose')
const app = require('./app')
const config = require('./config')
// const aux = require('./automaticTasks')

mongoose.connect(process.env.MONGODB, (err, res) => {
  if (err) {
    console.log('ERROR: connecting to Database. ' + err);
  } else {
    console.log("Connection to DB was succesfull")
    app.listen(process.env.PORT, () => {
      console.log(`Node server running on http://localhost:${process.env.PORT}`);
    });
  }
});

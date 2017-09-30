'use strict'

var mongoose = require('mongoose')
const app = require('./app')
const config = require('./config')

mongoose.connect(config.db, (err, res) => {
  if (err) {
    console.log('ERROR: connecting to Database. ' + err);
  } else {
    console.log("Connection to DB was succesfull")
    app.listen(config.port, () => {
      console.log(`Node server running on http://localhost:${config.port}`);
    });
  }
});

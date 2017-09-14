'use strict'

const mongoose = require('mongoose')
const User = require('../models/user')
const services = require('../services')

function signUp(req, res){
  const user = new User({
    email: req.body.email,
    displayName: req.body.displayName,
    avatarImage: req.body.avatarImage,
    password: req.body.password
  })

  user.save((err) => {
    if (err) res.status(500).send('Error creating the user')

    return res.status(200).send( { token: service.createToken(user)})
  })
}

function signIn(req, res){

}

module.exports = {
  signUp,
  signIn
}

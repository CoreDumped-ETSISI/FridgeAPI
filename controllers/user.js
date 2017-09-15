'use strict'

const mongoose = require('mongoose')
const User = require('../models/user')
const services = require('../services/index')

function signUp(req, res){
  console.log('POST /api/signUp')
  console.log(`Req.body = ${req.body.email}`)
  const user = new User({
    email: req.body.email,
    displayName: req.body.displayName,
    avatarImage: req.body.avatarImage,
    password: req.body.password
  })

  user.save((err) => {
    if (err) res.status(500).send('Error creating the user')

    return res.status(200).send({ token: services.createToken(user)})
  })
}

function signIn(req, res){

}

module.exports = {
  signUp,
  signIn
}

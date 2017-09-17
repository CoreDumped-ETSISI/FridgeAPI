'use strict'

const mongoose = require('mongoose')
const User = require('../models/user')
const services = require('../services/index')
const mail = require('../services/mailSender')
const bcrypt = require('bcrypt-nodejs')

function validateEmail(email) {       //TODO: Send this function to a service
    if (!email || email.length == 0) return false;
    var emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    return emailPattern.test(email);
}

function validatePassword(password) {       //TODO: Send this function to a service
    if (!password || password.length == 0) return false;
    var passwordPattern = /[a-z0-9_]{8,30}/i;
    return passwordPattern.test(password)
}

function signUp(req, res){
  console.log('POST /api/signUp')
  const email = req.body.email
  const displayName = req.body.displayName
  const avatarImage = req.body.avatarImage
  const password = req.body.password

  if(!validateEmail(email)) return res.status(500).send({ message: "Email inválido"})
  if(!validatePassword(password)) return res.status(500).send({ message: "Contraseña invalida. Debe tener mínimo 8 caracteres"})

  User.findOne({email: email})
  .exec((err, userExist) => {
    if(userExist) return res.status(500).send({ message: "Email en uso"})

    const user = new User({
      email: email,
      displayName: displayName,
      avatarImage: avatarImage,
      password: password,
      verified: false
    })

    user.save((err) => {
      if (err) res.status(500).send('Error creating the user')    //TODO: Change text

      return res.status(200).send({ token: services.createToken(user)})
    })
  })
}

function signIn(req, res){
  console.log('POST /api/signIn')
  if(!validateEmail(req.body.email)) return res.status(500).send({ message: "Email invalido"})

  User.findOne({email: req.body.email})
  .select('+password')
  .exec((err, user) => {
    if (err) res.status(500).send({ message : 'Error' })      //TODO: Change text
    if(!user) res.status(404).send({ message : 'Contraseña y/o usuario erroneos' })

    bcrypt.compare(req.body.password, user.password, (err, equals) =>{
      console.log(equals)
      if(equals == true) {
        res.status(200).send({
          message: "Te has logueado correctamente",
          token: services.createToken(user)
        })
        console.log("Token sended to " + user)
      }else{
        res.status(404).send({
          message: "Contraseña y/o usuario erroneos"
        })
      }
    })
  })
}

function updateUserData(req, res){        //TODO

  const user = new User({
    email: req.body.email,
    displayName: req.body.displayName,
    avatarImage: req.body.avatarImage,
    password: req.body.password
  })
}

module.exports = {
  signUp,
  signIn,
  updateUserData
}

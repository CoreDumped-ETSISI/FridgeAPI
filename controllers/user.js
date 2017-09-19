'use strict'

const mongoose = require('mongoose')
const User = require('../models/user')
const services = require('../services/index')
const mail = require('../services/mailManager')
const bcrypt = require('bcrypt-nodejs')
// const crypto = require('crypto');
const config = require('../config')

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
  if(!req.body.avatarImage) req.body.avatarImage = config.predefinedImage

  User.findOne({email: email})
  .exec((err, userExist) => {
    if(userExist) return res.status(500).send({ message: "Email en uso"})

    const user = new User({
      email: email,
      displayName: displayName,
      avatarImage: avatarImage,
      password: password,
      status: "Created"
    })

    user.save((err) => {
      if (err) res.status(500).send(err.message)

      return res.status(200).send({token: services.createToken(user)})
    })
  })
}

function signIn(req, res){                              //Change lastLogin field
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
        console.log("Token sent to " + user)
      }else{
        res.status(404).send({
          message: "Contraseña y/o usuario erroneos"
        })
      }
    })
  })
}

function updateUserData(req, res){
  var updatedFields = {}
  if(req.body.displayName) updatedFields.displayName = req.body.displayName
  if(req.body.avatarImage) updatedFields.avatarImage = req.body.avatarImage

  User.findByIdAndUpdate(req.user, updatedFields, (err, user) => {
    if (err) return res.status(500).send(err.message)
    return res.status(200).send({ message: "Cambios realizados" });
  })
}

function changePassword(req, res){
  const password = req.body.password
  if(!validatePassword(password)) return res.status(500).send({ message: "Contraseña invalida. Debe tener mínimo 8 caracteres"})
  User.findById(req.user, (err, user) => {
    if (err) return res.status(500).send(err.message)
    if (user){
      user.password = password
      user.save((err) => {
        if (err) res.status(500).send(err.message)
        return res.status(200).send({ message: "Contraseña cambiada con éxito" });
      })
    }
  })
}

function getUser(req, res){
  let userId = req.params.id
  console.log('GET /api/user/' + userId)

  User.findById(userId, (err, user) => {
    if (err) return res.status(500).send(err.message)
    if (!user) return res.status(404).send(err.message)
    res.status(200).send({
      user
    })
  })
}

function getUserList(req, res){
  console.log('GET /api/userList')

  User.find({}, (err, users) => {
    if (err) return res.status(500).send(err.message)
    if (!users) return res.status(404).send(message)
    res.status(200).send({
      users
    })
  })
}

function restorePassword(req, res){
  console.log('POST /api/restorePassword')
  var email = req.body.email
  if(!validateEmail(email)) return res.status(500).send(err.message)

  User.findOne({email: email})
  .exec((err, user) => {
    if(!user) return res.status(500).send(err.message)
      var token = "token_de_prueba"
      var expires = Date.now() + 3600000 * config.RESTORE_PASS_EXP
      user.resetPasswordToken = token
      user.resetPasswordExpires = expires
      user.save((err, user) => {
        mail.sendPasswordEmail(user.email, user.displayName, user.resetPasswordToken)
        return res.status(200).send({ message: "The new password has been sent to your email. Please change it as soon as possible."})
      })
  })
}

function resetPasswordGet(req, res){
  console.log('GET /api/resetPasswordGet')
  var email = services.decrypt(req.params.email)
  var token = req.params.token
  console.log(email)
  console.log(token)
  User.findOne({email: email})
  .exec((err, user) => {
    if(!user) return res.status(500).send(err.message)
    if(user.resetPasswordExpires >= Date.now() && user.resetPasswordToken == token){
      return res.status(200).send({ message: "POST resetPassword/:token params:password"})
    } else {
      return res.status(500).send(err.message)
    }
  })
}

function resetPasswordPost(req, res){
  var email = services.decrypt(req.params.email)
  var token = req.params.token
  var password = req.body.password
  console.log(email)
  console.log(token)
  User.findOne({email: email})
  .select('+password')
  .exec((err, user) => {
    if(!user) return res.status(500).send({ message: "Invalid token or has expired"})
    if(user.resetPasswordExpires >= Date.now() && user.resetPasswordToken == token){
      user.password = password
      user.save((err, user) => {
        return res.status(200).send({ message: "Congratulations!!! Password changed"})
      })
    } else {
      return res.status(500).send({ message: "Invalid token or has expired"})
    }
  })
}

module.exports = {
  signUp,
  signIn,
  updateUserData,
  changePassword,
  getUser,
  getUserList,
  restorePassword,
  resetPasswordGet,
  resetPasswordPost
}

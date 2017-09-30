'use strict'

const mongoose = require('mongoose')
const User = require('../models/user')
const services = require('../services/index')
const mail = require('../services/mailManager')
const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto');
const config = require('../config')

function signUp(req, res){
  const email = req.body.email
  const displayName = req.body.displayName
  const avatarImage = req.body.avatarImage
  const password = req.body.password

  if(!services.validateEmail(email)) return res.sendStatus(418)
  if(!services.validatePassword(password)) return res.sendStatus(418)
  if(!req.body.avatarImage) req.body.avatarImage = config.predefinedImage

  User.findOne({email: email})
  .exec((err, userExist) => {
    if(userExist) return res.sendStatus(500)

    const user = new User({
      email: email,
      displayName: displayName,
      avatarImage: avatarImage,
      password: password,
      status: "Created",
      balance: 0
    })

    user.save((err, user) => {
      if (err) return res.sendStatus(500)
      if (!user) return res.sendStatus(500)
      // mail.sendWelcomeEmail(user.email, user.displayName)   Commented while API is in development
      return res.status(200).send({ token: services.createToken(user) })
    })
  })
}

function login(req, res){
  if (!services.validateEmail(req.body.email)) return res.sendStatus(418)
  if (!req.body.password) return res.sendStatus(418)

  User.findOne({email: req.body.email})
  .select('+password +admin')
  .exec((err, user) => {
    if (err) return res.sendStatus(500)
    if (!user) return res.sendStatus(404)

    bcrypt.compare(req.body.password, user.password, (err, equals) => {
      if (err) return res.sendStatus(500)
      if (!equals) return res.sendStatus(404)
      return res.status(200).send({
        isAdmin: services.isAdmin(user),
        token: services.createToken(user) })
    })
  })
}

function updateUserData(req, res){
  var updatedFields = {}
  if(req.body.displayName) updatedFields.displayName = req.body.displayName
  if(req.body.avatarImage) updatedFields.avatarImage = req.body.avatarImage

  User.findByIdAndUpdate(req.user, updatedFields, (err, user) => {
    if (err) return res.sendStatus(500)
    if (!user) return res.sendStatus(404)
    return res.sendStatus(200)
  })
}

function changePassword(req, res){
  const password = req.body.password
  if(!services.validatePassword(password)) return res.sendStatus(418)
  User.findById(req.user, (err, user) => {
    if (err) return res.sendStatus(500)
    if (!user) return res.sendStatus(404)
    user.password = password
    user.save((err) => {
      if (err) return res.sendStatus(500)
      return res.sendStatus(200)
    })

  })
}

function getUser(req, res){
  let userId = req.params.id

  User.findById(userId, (err, user) => {
    if (err) return res.sendStatus(500)
    if (!user) return res.sendStatus(404)
    return res.status(200).send({user})
  })
}

function getUserList(req, res){
  User.find({}, (err, users) => {
    if (err) return res.sendStatus(500)
    if (!users) return res.sendStatus(404)
    res.status(200).send({ users })
  })
}

function restorePassword(req, res){
  var email = req.body.email
  if(!services.validateEmail(email)) return res.sendStatus(501)

  User.findOne({email: email})
  .exec((err, user) => {
    if(!user) return res.sendStatus(404)
    crypto.randomBytes(20,(err,token) => {
      if (err) return res.sendStatus(500)
      if (!token) return res.sendStatus(500)
      var expires = Date.now() + 3600000 * config.RESTORE_PASS_EXP
      user.resetPasswordToken = token.toString('hex')
      user.resetPasswordExpires = expires
      user.save((err, user) => {
        mail.sendPasswordEmail(user.email, user.displayName, user.resetPasswordToken)
        return res.sendStatus(200)
      })
    })
  })
}

function resetPasswordGet(req, res){
  var email = services.decrypt(req.params.email)
  var token = req.params.token
  User.findOne({email: email})
  .exec((err, user) => {
    if (err) return res.sendStatus(500)
    if(!user) return res.sendStatus(404)
    if(user.resetPasswordExpires < Date.now() || user.resetPasswordToken != token)
      return res.sendStatus(403)
    return res.sendStatus(200)
  })
}


function resetPasswordPost(req, res){
  var email = services.decrypt(req.params.email)
  var token = req.params.token
  var password = req.body.password
  User.findOne({email: email})
  .select('+password')
  .exec((err, user) => {
    if (err) return res.sendStatus(500)
    if(!user) return res.sendStatus(404)
    if(user.resetPasswordExpires < Date.now() || user.resetPasswordToken != token)
      return res.sendStatus(403)

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    user.save((err, user) => {
      if (err) return res.sendStatus(500)
      return res.sendStatus(200)
    })
  })
}

module.exports = {
  signUp,
  login,
  updateUserData,
  changePassword,
  getUser,
  getUserList,
  restorePassword,
  resetPasswordGet,
  resetPasswordPost
}

'use strict'

const services = require('../services')
const input = require('../services/inputValidators')
const token = require('../services/token')
const mail = require('../services/mailManager')
const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto');
const User = require('../models/user')
const config = require('../config')

function signUp(req, res){
  var email = req.body.email
  var displayName = req.body.displayName
  var avatarImage = req.body.avatarImage
  var password = req.body.password

  if(!req.body.displayName) displayName = config.predefinedDisplayName
  if(!req.body.avatarImage) avatarImage = config.predefinedImage

  if(!input.validEmail(email)) return res.sendStatus(400)
  email = services.normEmail(email)
  if(!input.validPassword(password)) return res.sendStatus(400)
  if(!input.validName(displayName)) return res.sendStatus(400)
  if(!input.validURL(avatarImage)) return res.sendStatus(400)

  User.findOne({email: email})
  .exec((err, userExist) => {
    if (err) return res.sendStatus(500)
    if (userExist) return res.sendStatus(409)

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
      // mail.sendWelcomeEmail(user.email, user.displayName)   //FIXME Commented while API is in development
      return res.status(200).send({
        isAdmin: services.isAdmin(user),
        token: token.generate(user) })
    })
  })
}

function login(req, res){
  if (!input.validEmail(req.body.email)) return res.sendStatus(400)
  if (!req.body.password) return res.sendStatus(400)

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
        token: token.generate(user) })
    })
  })
}

function updateUserData(req, res){
  if (!req.body.displayName &&
      !req.body.avatarImage &&
      !req.body.password)
      return res.sendStatus(400)

  var updatedFields = {}
  if(req.body.displayName) {
    updatedFields.displayName = req.body.displayName
    if (!input.validName(updatedFields.displayName)) return res.sendStatus(400)
  }
  if(req.body.avatarImage) {
    updatedFields.avatarImage = req.body.avatarImage
    if (!input.validURL(updatedFields.avatarImage)) return res.sendStatus(400)
  }
  if(req.body.password) {
    updatedFields.password = req.body.password
    if(!input.validPassword(updatedFields.password)) return res.sendStatus(400)
  }

  User.findById(req.user, (err, user) => {
    if (err) return res.sendStatus(500)
    if (!user) return res.sendStatus(404)
    user.set(updatedFields)
    user.save((err) => {
      if (err) return res.sendStatus(500)
      return res.sendStatus(200)
    })
  })
}

function getUserData(req, res){
  User.findById(req.user, (err, user) => {
    if (err) return res.sendStatus(500)
    if (!user) return res.sendStatus(404)
    return res.status(200).send(user)
  })
}

function getUser(req, res){
  let userId = req.params.id
  if(!input.validId(userId)) return res.sendStatus(400)

  User.findById(userId, (err, user) => {
    if (err) return res.sendStatus(500)
    if (!user) return res.sendStatus(404)
    return res.status(200).send(user)
  })
}

function getUserList(req, res){
  User.find({}, (err, users) => {
    if (err) return res.sendStatus(500)
    if (!users) return res.sendStatus(404)
    res.status(200).send(users)
  })
}

function restorePassword(req, res){
  var email = req.body.email
  if(!input.validEmail(email)) return res.sendStatus(400)

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

function resetPasswordPost(req, res){
  var email = services.decrypt(req.params.email)
  var token = req.params.token
  var password = req.body.password

  if(!input.validPassword(password)) return res.sendStatus(400)

  User.findOne({email: email})
  .select('+password +resetPasswordExpires +resetPasswordToken')
  .exec((err, user) => {
    if (err) return res.sendStatus(500)
    if(!user) return res.sendStatus(404)
    if(!user.resetPasswordExpires ||
       !user.resetPasswordToken ||
       user.resetPasswordExpires < Date.now() ||
       user.resetPasswordToken != token)
       return res.sendStatus(401)

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    user.save((err, user) => {
      if (err) return res.sendStatus(500)
      return res.sendStatus(200)
    })
  })
}

function deleteUser(req, res) {
  let userId = req.params.id
  if(!input.validId(userId)) return res.sendStatus(400)

  User.findById(userId, (err, user) => {
    if (err) return res.sendStatus(500)
    if (!user) return res.sendStatus(404)
    user.remove()
    return res.sendStatus(200)
  })
}

function verifyUser(req, res) {
  let userId = req.params.id
  if(!input.validId(userId)) return res.sendStatus(400)

  User.findById(userId, (err, user) => {
    if (err) return res.sendStatus(500)
    if (!user) return res.sendStatus(404)
    user.set({status: 'Verified'})
    user.save((err, userStored) => {
      return res.sendStatus(200)
    })
  })
}

module.exports = {
  signUp,
  login,
  updateUserData,
  getUserData,
  getUser,
  getUserList,
  restorePassword,
  resetPasswordPost,
  deleteUser,
  verifyUser
}

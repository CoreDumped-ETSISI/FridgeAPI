'use strict'

const jwt = require('jwt-simple')
const crypto = require('crypto')
const moment = require('moment')
const config = require('../config')

const User = require('../models/user')

function createToken(user) {
  const payload = {
    sub: encrypt(String(user._id)),
    iat: moment.unix(),
    exp: moment().add(config.EXP_DAYS, 'days').unix()
  }
  return jwt.encode(payload, config.SECRET_TOKEN)
}

function decodeToken(token) {
  const decoded = new Promise((resolve, reject) => {
    try{
      const payload = jwt.decode(token, config.SECRET_TOKEN)

      if(payload.exp <= moment().unix()) {
        reject({
          status: 401,
          message: 'Your authorization has expired'
        })
      }
      var userId = decrypt(payload.sub)
      console.log(userId + " logged")
      resolve(userId)
    } catch (err) {
      console.log("Error decoding token " + token)
      reject({
        status: 500,
        message: 'Invalid token'
      })
    }
  })
  return decoded
}

function encrypt(text){
  var cipher = crypto.createCipher(config.algorithm,config.password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text){
  var decipher = crypto.createDecipher(config.algorithm,config.password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

function calcPrice(marketPrice){
  return marketPrice * config.profit  //TODO: Correct the algorithm
}

function validEmail(email) {
    if (!email || email.length == 0) return false;
    var emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    return emailPattern.test(email);
}

function normEmail(email) {
    return email.toLowerCase(); //TODO
}

function validPassword(password) {
    if (!password || password.length == 0) return false;
    var passwordPattern = /[a-z0-9_]{8,30}/i; //TODO: Use variables
    return passwordPattern.test(password)
}

function validName(name) {
  if (!name || name.length == 0) return false;
  var namePattern = /[a-z ]{2,40}/i; //TODO: Use variables
  return namePattern.test(name)
}

function validProductName(name) {
  if (!name || name.length == 0) return false;
  var namePattern = /[-_a-z 0-9]{2,40}/i; //TODO: Use variables
  return namePattern.test(name)
}

function validURL(url) {
  if (!url || url.length == 0) return false;
  var urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/; //TODO: Use variables
  return urlPattern.test(url)
}

function validFloat(num) {
  if (!num || num.length == 0) return false;
  var numPattern = /[0-9]{1}(\.[0-9]+)?/g; //TODO: Use variables
  return numPattern.test(num)
}

function validInt(num) {
  if (!num || num.length == 0) return false;
  var numPattern = /[0-9]+/; //TODO: Use variables
  return numPattern.test(num)
}

function validId(id) {
  if (!id || id.length == 0) return false;
  var idPattern = /[a-f0-9]{24}/i; //TODO: Use variables
  return idPattern.test(id)
}

function isAdmin(user) {
    return user.admin == config.ADMIN_TOKEN
}

function countOccurrences(obj, list){
  var count = 0
  for(var i = 0; i < list.length; i++){
    if(obj == list[i])
    count++
  }
  return count
}

module.exports = {
  createToken,
  decodeToken,
  encrypt,
  decrypt,
  calcPrice,
  validEmail,
  validPassword,
  validName,
  validURL,
  validId,
  validProductName,
  validFloat,
  validInt,
  normEmail,
  isAdmin,
  countOccurrences
}

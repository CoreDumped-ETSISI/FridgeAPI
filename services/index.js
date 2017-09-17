'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../config')

function createToken(user) {
  const payload = {
    sub: user._id,
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
      console.log(payload.sub + " logged")
      resolve(payload.sub)
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



module.exports = {
  createToken,
  decodeToken
}

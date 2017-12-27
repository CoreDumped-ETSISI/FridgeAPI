'use strict'

const express = require ('express')
const api = express.Router()
const userCtrl = require ('../controllers/user')

//PUBLIC
api.post('/signUp', userCtrl.signUp)
api.post('/login', userCtrl.login)
api.post('/verifyEmail', userCtrl.verifyEmail)
api.post('/restorePassword/', userCtrl.restorePassword)
api.post('/resetPassword/:email/:token', userCtrl.resetPasswordPost)

module.exports = api

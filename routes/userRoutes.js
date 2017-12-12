'use strict'

const express = require ('express')
const api = express.Router()
const userCtrl = require ('../controllers/user')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')

//AUTH
api.get('/', auth, userCtrl.getUserData)
api.post('/edit', auth, userCtrl.updateUserData)

//ADMIN
api.get('/list', auth, admin, userCtrl.getUserList)
api.get('/id/:id', auth, admin, userCtrl.getUser)
api.post('/id/:id/status', auth, admin, userCtrl.setUserStatus)
api.delete('/id/:id/delete', auth, admin, userCtrl.deleteUser)

module.exports = api

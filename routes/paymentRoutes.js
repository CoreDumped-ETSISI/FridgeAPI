'use strict'

const express = require ('express')
const api = express.Router()
const paymentCtrl = require ('../controllers/payment')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')

api.post('/save', auth, admin, paymentCtrl.savePayment)
api.get('/list', auth, paymentCtrl.getPaymentList)
api.get('/id/:id', auth, paymentCtrl.getPayment)
api.post('/id/:id/edit', auth, admin, paymentCtrl.updatePayment)
api.delete('/id/:id/delete', auth, admin, paymentCtrl.deletePayment)

module.exports = api

'use strict'

const express = require ('express')
const userCtrl = require ('../controllers/user')
const productCtrl = require ('../controllers/product')
const purchaseCtrl = require ('../controllers/purchase')
const paymentCtrl = require ('../controllers/payment')
const auth = require('../middlewares/auth')
const api = express.Router()

const mail = require('../services/mailSender')

api.get('/product/:id', productCtrl.getProduct)
api.get('/productList', productCtrl.getProductList)
api.post('/saveProduct', auth, productCtrl.saveProduct)

api.get('/purchase/:id', auth, purchaseCtrl.getPurchase)
api.get('/purchaseList', auth, purchaseCtrl.getPurchaseList)
api.post('/savePurchase', auth, purchaseCtrl.savePurchase)

api.get('/payment/:id', auth, paymentCtrl.getPayment)
api.get('/paymentList', auth, paymentCtrl.getPaymentList)
api.post('/savePayment', auth, paymentCtrl.savePayment)

api.post('/signUp', userCtrl.signUp)                          //TODO: Check data recived
api.post('/signIn', userCtrl.signIn)                          //TODO: Check data recived
api.post('/updateUserData', auth, userCtrl.updateUserData)    //TODO: Check data recived

api.get('/lastPurchases', auth, purchaseCtrl.getLastPurchases)
// api.get('/send', mail)

module.exports = api

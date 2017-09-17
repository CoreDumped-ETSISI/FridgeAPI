'use strict'

const express = require ('express')
const userCtrl = require ('../controllers/user')
const productCtrl = require ('../controllers/product')
const purchaseCtrl = require ('../controllers/purchase')
const paymentCtrl = require ('../controllers/payment')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const api = express.Router()

const mail = require('../services/mailManager')

api.get('/product/:id', productCtrl.getProduct)
api.get('/productList', productCtrl.getProductList)
api.post('/saveProduct', auth, admin, productCtrl.saveProduct)

api.get('/purchase/:id', auth, purchaseCtrl.getPurchase)
api.get('/purchaseList', auth, purchaseCtrl.getPurchaseList)
api.get('/lastPurchases', auth, purchaseCtrl.getLastPurchases)
api.post('/savePurchase', auth, purchaseCtrl.savePurchase)

api.get('/payment/:id', auth, paymentCtrl.getPayment)
api.get('/paymentList', auth, paymentCtrl.getPaymentList)
api.post('/savePayment', auth, admin, paymentCtrl.savePayment)

api.get('/user/:id', auth, admin, userCtrl.getUser)
api.get('/userList', auth, admin, userCtrl.getUserList)
api.post('/updateUserData', auth, userCtrl.updateUserData)    //TODO: Check data recived

api.post('/signUp', userCtrl.signUp)                          //TODO: Check data recived
api.post('/signIn', userCtrl.signIn)                          //TODO: Check data recived
api.post('/changePassword', auth, userCtrl.changePassword)    //TODO: Check data recived
api.post('/restorePassword/', userCtrl.restorePassword)       //TODO: Check data recived
api.get('/resetPassword/:email/:token', userCtrl.resetPasswordGet)
api.post('/resetPassword/:email/:token', userCtrl.resetPasswordPost)   //TODO: Check data recived


module.exports = api

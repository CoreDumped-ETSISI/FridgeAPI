'use strict'

const express = require ('express')
const userCtrl = require ('../controllers/user')
const productCtrl = require ('../controllers/product')
const purchaseCtrl = require ('../controllers/purchase')
const paymentCtrl = require ('../controllers/payment')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const api = express.Router()

api.get('/product/:id', productCtrl.getProduct)
api.get('/productList', productCtrl.getProductList)
api.post('/updateProduct/:id', auth, admin, productCtrl.updateProduct)
api.post('/saveProduct', auth, admin, productCtrl.saveProduct)
api.delete('/deleteProduct/:id', auth, admin, productCtrl.deleteProduct)

api.get('/purchase/:id', auth, purchaseCtrl.getPurchase)
api.get('/purchaseList', auth, purchaseCtrl.getPurchaseList)
api.get('/lastPurchases', auth, purchaseCtrl.getLastPurchases)
api.post('/savePurchase', auth, purchaseCtrl.savePurchase)
api.delete('/deletePurchase/:id', auth, admin, purchaseCtrl.deletePurchase)

api.get('/payment/:id', auth, paymentCtrl.getPayment)
api.get('/paymentList', auth, paymentCtrl.getPaymentList)
api.post('/updatePayment/:id', auth, admin, paymentCtrl.updatePayment)
api.post('/savePayment', auth, admin, paymentCtrl.savePayment)
api.delete('/deletePayment/:id', auth, admin, paymentCtrl.deletePayment)

api.get('/user', auth, userCtrl.getUserData)
api.get('/user/:id', auth, admin, userCtrl.getUser)
api.get('/userList', auth, admin, userCtrl.getUserList)
api.post('/updateUserData', auth, userCtrl.updateUserData)    //TODO: Check data recived

api.post('/signUp', userCtrl.signUp)                          //TODO: Check data recived
api.post('/login', userCtrl.login)                          //TODO: Check data recived
api.post('/restorePassword/', userCtrl.restorePassword)       //TODO: Check data recived
api.post('/resetPassword/:email/:token', userCtrl.resetPasswordPost)   //TODO: Check data recived
api.delete('/deleteUser/:id', userCtrl.deleteUser)

module.exports = api

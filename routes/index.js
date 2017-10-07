'use strict'

const express = require ('express')
const api = express.Router()
const userCtrl = require ('../controllers/user')
const productCtrl = require ('../controllers/product')
const purchaseCtrl = require ('../controllers/purchase')
const paymentCtrl = require ('../controllers/payment')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const verified = require('../middlewares/verified')

api.get('/product/:id', productCtrl.getProduct)
api.get('/productList', productCtrl.getProductList)
api.get('/availableProductList', productCtrl.getAvailableProductList)
api.post('/updateProduct/:id', auth, admin, productCtrl.updateProduct)
api.post('/saveProduct', auth, admin, productCtrl.saveProduct)
api.delete('/deleteProduct/:id', auth, admin, productCtrl.deleteProduct)

api.get('/purchase/:id', auth, purchaseCtrl.getPurchase)
api.get('/purchaseList', auth, purchaseCtrl.getPurchaseList)
api.get('/lastPurchases', auth, verified, purchaseCtrl.getLastPurchases)
api.post('/savePurchase', auth, verified, purchaseCtrl.savePurchase)
api.delete('/deletePurchase/:id', auth, admin, purchaseCtrl.deletePurchase)

api.get('/payment/:id', auth, paymentCtrl.getPayment)
api.get('/paymentList', auth, paymentCtrl.getPaymentList)
api.post('/updatePayment/:id', auth, admin, paymentCtrl.updatePayment)
api.post('/savePayment', auth, admin, paymentCtrl.savePayment)
api.delete('/deletePayment/:id', auth, admin, paymentCtrl.deletePayment)

api.post('/signUp', userCtrl.signUp)
api.post('/login', userCtrl.login)
api.get('/user', auth, userCtrl.getUserData)
api.get('/user/:id', auth, admin, userCtrl.getUser)
api.get('/userList', auth, admin, userCtrl.getUserList)
api.post('/updateUserData', auth, userCtrl.updateUserData)
api.post('/restorePassword/', userCtrl.restorePassword)
api.post('/resetPassword/:email/:token', userCtrl.resetPasswordPost)
api.post('/verifyUser/:id', auth, admin, userCtrl.verifyUser)
api.delete('/deleteUser/:id', auth, admin, userCtrl.deleteUser)

module.exports = api

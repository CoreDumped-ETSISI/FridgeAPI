'use strict'

const express = require ('express')
const userCtrl = require ('../controllers/user')
const productCtrl = require ('../controllers/product')
const purchaseCtrl = require ('../controllers/purchase')
const auth = require('../middlewares/auth')
const api = express.Router()

api.get('/product/:id', productCtrl.getProduct)
api.get('/productList', productCtrl.getProductList)
api.post('/saveProduct', auth, productCtrl.saveProduct)

api.get('/purchase/:id', purchaseCtrl.getPurchase)
api.get('/purchaseList', purchaseCtrl.getPurchaseList)
api.post('/savePurchase', auth, purchaseCtrl.savePurchase)

api.post('/signUp', userCtrl.signUp) //TODO: Check data recived


module.exports = api

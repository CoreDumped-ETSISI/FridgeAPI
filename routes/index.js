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
api.get('/purchases', purchaseCtrl.getPurchases)
api.post('/savePurchase', auth, purchaseCtrl.savePurchase)
api.post('/signUp', userCtrl.signUp) //TODO: Check data recived


// api.get('/private', auth, function(req,res) {
//   res.status(200).send( {message: 'Success', user: req.user} )
// })

module.exports = api

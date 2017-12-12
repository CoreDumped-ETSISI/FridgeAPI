'use strict'

const express = require ('express')
const api = express.Router()
const productCtrl = require ('../controllers/product')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')

api.post('/save', auth, admin, productCtrl.saveProduct)
api.get('/list', productCtrl.getProductList)
api.get('/inStock', productCtrl.getAvailableProductList)
api.get('/id/:id', productCtrl.getProduct)
api.post('/id/:id/edit', auth, admin, productCtrl.updateProduct)
api.delete('/id/:id/delete', auth, admin, productCtrl.deleteProduct)

module.exports = api

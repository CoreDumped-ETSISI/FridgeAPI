'use strict'

const express = require ('express')
const userCtrl = require ('../controllers/user')
const productCtrl = require ('../controllers/product')
const api = express.Router()

api.get('/productList', productCtrl.getProductList)

module.exports = api

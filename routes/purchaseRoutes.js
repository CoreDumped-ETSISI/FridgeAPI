'use strict'

const express = require ('express')
const api = express.Router()
const purchaseCtrl = require ('../controllers/purchase')
const verified = require('../middlewares/verified')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')

api.post('/save', auth, verified, purchaseCtrl.savePurchase)
api.get('/list', auth, purchaseCtrl.getPurchaseList)
api.get('/listAll', auth, admin, purchaseCtrl.getPurchaseListAll)
api.get('/recents', auth, verified, purchaseCtrl.getLastPurchases)
api.get('/id/:id', auth, purchaseCtrl.getPurchase)
api.delete('/id/:id/delete', auth, admin, purchaseCtrl.deletePurchase)

module.exports = api

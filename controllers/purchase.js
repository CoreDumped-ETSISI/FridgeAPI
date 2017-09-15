'use strict'

const mongoose = require('mongoose')
const Purchase = require('../models/purchase')

function getPurchase(req, res) {
  let purchaseId = req.params.id
  console.log('GET /api/purchase/' + purchaseId)

  Purchase.findById(purchaseId, (err, purchase) => {
    if (err) return res.status(500).send({
      message: 'Error'
    })
    if (!purchase) return res.status(404).send({
      message: 'The purchase does not exist'
    })
    res.status(200).send({
      purchase
    })
  })
}

function savePurchase(req, res) {
  console.log("POST /api/savePurchase")

  const purchase = new Purchase({
    amount: req.body.amount,
    productList: req.body.productList
    // timestamp: req.body.timestamp
  })
  //TODO: Check if amount is correct
  purchase.save((err, purchaseStored) => {
    if(err) res.status(500).send({
      message: `A error ocurried during saving your purchase ${err}`
    })
    res.status(200).send({
      message: purchaseStored
    })
  })
}

module.exports = {
  getPurchase,
  savePurchase
}

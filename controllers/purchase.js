'use strict'

const mongoose = require('mongoose')
const Purchase = require('../models/purchase')
const Product = require('../models/product')

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

function getPurchases(req, res) {
  console.log('GET /api/purchases/')

  Purchase.find({})
    .populate('productList')
    .exec((err, purchases) => {
      if (err) return res.status(500).send({
        message: 'Error'
      })
      if (!purchases) return res.status(404).send({
        message: 'The purchases does not exist'
      })
      res.status(200).send({
        purchases
      })
    })
}

function savePurchase(req, res) {
  console.log("POST /api/savePurchase")

  let idList = req.body.productList.split(",")

  Product.find({ _id: {$in: idList} })
    .exec(function(err, products) {
        if (err) res.status(500).send({
          message: `A error ocurried during saving your purchase ${err}`
        })
        // console.log(products)
        const purchase = new Purchase({
          amount: req.body.amount,
          productList: products
        })

        purchase.save((err, purchaseStored) => {
          if (err) res.status(500).send({
            message: `A error ocurried during saving your purchase ${err}`
          })
          res.status(200).send({
            message: purchaseStored
          })
        })
      })


  // console.log("Purchase created. Saving...")

  //TODO: Check if amount is correct

  // Purchase.populate(purchase, {path:"productList"}, function(err, pur) {

  // purchase.save((err, purchaseStored) => {
  //   if(err) res.status(500).send({
  //     message: `A error ocurried during saving your purchase ${err}`
  //   })
  //   res.status(200).send({
  //     message: purchaseStored
  //   })
  // })

  // });

}

module.exports = {
  getPurchase,
  getPurchases,
  savePurchase
}

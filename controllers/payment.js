'use strict'

const mongoose = require('mongoose')
const Payment = require('../models/payment')

function getPayment(req, res) {
  let paymentId = req.params.id
  console.log('GET /api/payment/' + paymentId)

    Payment.findOne({ _id:paymentId, userId: req.user })
      .select("-userId -__v")                         //TODO: Overwrite function toJSON to avoid this
      .exec((err, payment) => {
        if (err) return res.status(500).send(err.message)
        if (!payment || payment.length == 0) return res.status(404).send(err.message)
        return res.status(200).send({
          payment
        })
      })
}

function getPaymentList(req, res) {
  console.log('GET /api/paymentList')

  Payment.find({userId: req.user}, "-userId -__v", (err, payments) => {
      if (err) return res.status(500).send(err.message)
      if (!payments || payments.length == 0) return res.status(404).send(err.message)
      res.status(200).send(
        payments
      )
    })
}

function savePayment(req, res) {
  console.log('POST /api/savePayment')
  if(!req.body.amount) return res.status(500).send(err.message)

  const payment = new Payment({
    userId: req.user,
    amount: req.body.amount
  })

  console.log(payment)
  payment.save( (err, paymentStored) => {
    console.log(paymentStored)

    if (err) res.status(500).send(err.message)
    var cl = paymentStored.toObject()
    delete cl.userId                            //TODO: Overwrite function toJSON to avoid this
    delete cl.__v
    res.status(200).send(cl)
  })
}

module.exports = {
  getPayment,
  getPaymentList,
  savePayment
}

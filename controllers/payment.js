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

function updatePayment(req, res) {
  const paymentId = req.params.id
  console.log('GET /api/updatePayment/' + paymentId)

  if(!req.body.amount) return res.status(418).send({ message: "Amount parameter is needed"})

  Payment.findOne({ _id:paymentId })
    .exec((err, payment) => {
      if (err) return res.status(500).send({
        message: 'Error'                            //TODO:Change text
      })
      if (!payment || payment.length == 0) return res.status(404).send({
        message: 'The payments does not exist'     //TODO:Change text
      })
      payment.amount = req.body.amount
      payment.save( (err, paymentStored) => {
        if (err) return res.status(500).send({
            message: `A error ocurried during saving your payment ${err}`   //TODO:Remove errors outputs
        })
        return res.status(200).send({payment})
      })

    })
}

function savePayment(req, res) {
  console.log('POST /api/savePayment')
  if(!req.body.amount || !req.body.userId) return res.status(500).send(err.message)

  console.log(req.body.amount)
  console.log(req.body.userId)
  console.log(req.user)

  const payment = new Payment({
    userId: req.body.userId,
    adminId: req.user,
    amount: req.body.amount
  })

  console.log(payment)
  payment.save( (err, paymentStored) => {
    console.log(paymentStored)

    if (err) res.status(500).send(err.message)
    var cl = paymentStored.toObject()
    delete cl.userId                            //TODO: Overwrite function toJSON to avoid this
    delete cl.adminId
    delete cl.__v
    return res.status(200).send(cl)
  })
}

module.exports = {
  getPayment,
  getPaymentList,
  updatePayment,
  savePayment
}

'use strict'

const mongoose = require('mongoose')
const Payment = require('../models/payment')
const Payments = require('../models/payments')

function getPayment(req, res) {
  let paymentId = req.params.id
  console.log('GET /api/payment/' + paymentId)

    Payments.findById(req.user, (err, payments) => {
        if (err) return res.status(500).send({
          message: 'Error'
        })
        if (!payments) return res.status(404).send({
          message: 'The payments does not exist'     //TODO:Change text
        })
        payments = payments.payments
        for (var x = 0; x < payments.length; x++) {  //TODO:Make this in a query??
          console.log(payments[x])
          if(payments[x]._id == paymentId)
            return res.status(200).send(
              payments[x]
            )
        }
        return res.status(404).send({
          message: 'The payment does not exist'      //TODO:Change text
        })
      })
}

function getPaymentList(req, res) {
  console.log('GET /api/paymentList')
  console.log(req.user)

  Payments.findById(req.user, "-_id", (err, payments) => {
    console.log(payments)
      if (err) return res.status(500).send({
        message: 'Error'                            //TODO:Change text
      })
      if (!payments) return res.status(404).send({
        message: 'The payments does not exist'     //TODO:Change text
      })
      res.status(200).send(
        payments
      )
    })
}

function savePayment(req, res) {
  console.log('POST /api/savePayment')
  if(!req.body.amount) return res.status(500).send({
    message: 'Error'                            //TODO:Change text
  })

  const payment = new Payment({
    amount: req.body.amount
  })

  console.log(payment)
  Payments.findByIdAndUpdate(req.user, {$push: { "payments" : payment }}, { upsert: true, fields: "-_id" } , (err, paymentStored) => {
    console.log(paymentStored)
    if (err) res.status(500).send({
        message: `A error ocurried during saving your payment ${err}`   //TODO:Remove errors outputs
    })
    res.status(200).send(paymentStored)
  })

}

module.exports = {
  getPayment,
  getPaymentList,
  savePayment
}

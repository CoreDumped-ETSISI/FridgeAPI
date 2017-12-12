'use strict'

const bodyParser  = require("body-parser")
const cors = require("cors")
const express = require("express")
const app = express()
const logger = require('./services/logger')

const routes = require('./routes')
const productRoutes = require('./routes/productRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const purchaseRoutes = require('./routes/purchaseRoutes')
const userRoutes = require('./routes/userRoutes')
const utilityRoutes = require('./routes/utilityRoutes')


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

logger(app)

app.use('/', routes)
app.use('/product', productRoutes)
app.use('/payment', paymentRoutes)
app.use('/purchase', purchaseRoutes)
app.use('/user', userRoutes)
app.use('/utility', utilityRoutes)

module.exports = app;

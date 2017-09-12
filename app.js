
const express = require("express")
const bodyParser  = require("body-parser")
const mongoose = require('mongoose')

const Product = require('./models/product')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api', (req,res) => {
  res.status(200).send("Welcome!!")
})

app.get('/api/product/:id', (req, res) => {
  let productId = req.params.id
  console.log('GET /api/product/' + productId)

  Product.findById(productId, (err, product) => {
    if (err) return res.status(500).send({message: 'Error'})
    if (!product) return res.status(404).send({message: 'The product not exist'})
    res.status(200).send({ product })
  })
})

app.get('/api/productList', (req, res) => {
  console.log('GET /api/productList')

  Product.find({}, (err, products) => {
    if (err) return res.status(500).send({message: 'Error'})
    if (!products) return res.status(404).send({message: 'The product not exist'})
    res.status(200).send({ products })
  })
})

app.post('/api/createProduct', (req, res) => {
  console.log('POST /api/createProduct')
  console.log(req.body)

  let product = new Product()
  product.name = req.body.name
  product.price = req.body.price

  product.save((err, productStored) => {
    if(err) res.status(500).send({massage: 'Error saving the product in the DB'})
    res.status(200).send({product: productStored})
  })
})

mongoose.connect('mongodb://localhost:27017/tvshows', (err, res) => {
  if(err) {
    console.log('ERROR: connecting to Database. ' + err);
  }
  app.listen(port, () => {
    console.log("DBNode server running on http://localhost:3000");
  });
});

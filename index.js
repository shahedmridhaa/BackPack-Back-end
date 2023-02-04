const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const port = 3003

// middleWare
app.use(cors())
app.use(express.json())
 app.use(express.urlencoded({extended: true}))

//Create Product Schema
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "product title is requires"],
  },
  email:{
    type: String,
    required :true,
    unique : true
  },

  price:  {
    type: Number,
    min: 20,
    max: 2000,
    required: [true, "product Number is requires"],  },
     
  rating:  {
    type: Number,
    required: [true, "product rating is requires"],
  },
  description:  {
    type: String,
    required:[true, "product description is requires"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

//Create Product model
const Product = mongoose.model('Products', productSchema)



// ===database connected====
const connectionDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/testProductDb')
    console.log('dataBase Connected')
  } catch (error) {
    console.log('dataBase not Connected')
    console.log(error.message)
  }
}

app.get('/', (req, res) => {
  res.send('welcome to server')
})



// === post data ====
app.post('/products', async (req, res) => {
  try {
    const newProduct = new Product({
      title : req.body.title,
      price : req.body.price,
      rating : req.body.rating,
      description : req.body.description
    })
    const productData = await newProduct.save()
    res.status(201).send(productData)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})


 

// ===get Product====
 app.get('/products', async(req, res) =>{
     try {
        const products = await Product.find()
        if(products){
         res.status(200).send(products)
        }else{
           res.status(404).send({message : "product not found"})
        }
     } catch (error) {
         res.status(500).send({message: error.message})
     }
 })



// ===get Product with Limit====
 app.get('/products', async(req, res) =>{
   try {
      const products = await Product.find().limit(2)
      if(products){
       res.status(200).send(products)
      }else{
         res.status(404).send({message : "product not found"})
      }
   } catch (error) {
       res.status(500).send({message: error.message})
   }
 })




// ===get specific Product====
 app.get('/product/:id', async(req, res) =>{
   try {
     const id = req.params.id
      const product = await Product.findOne({_id: id})
      if(product){
       res.status(200).send(product)
      }else{
         res.status(404).send({message : "product not found"})
      }
   } catch (error) {
       res.status(500).send({message: error.message})
   }
 })



// ===get specafic Product title====
 app.get('/product/:id', async(req, res) =>{
   try {
     const id = req.params.id
      const product = await Product.findOne({_id: id}, {title : 1, _id:0})
      if(product){
       res.status(200).send(product)
      }else{
         res.status(404).send({message : "product not found"})
      }
   } catch (error) {
       res.status(500).send({message: error.message})
   }
 })



// === get data comparasion Operator====
app.get('/products', async(req, res) =>{
  try {
     const products = await Product.find({price: {$lte : 300}})
     if(products){
      res.status(200).send(products)
     }else{
        res.status(404).send({message : "product not found"})
     }
  } catch (error) {
      res.status(500).send({message: error.message})
  }
})


// === get data comparasion Operator daynamic Price====
 app.get('/products', async(req, res) =>{
   try {
     const price = req.query.price
     if(price){
        const  products = await Product.find({price: {$lte : price}})
        res.status(200).send(products)
     }else{
       const products = await Product.find()
       res.status(200).send(products)
     }
   } catch (error) {
       res.status(500).send({message: error.message})
   }
 }



// === get data Logical Operator ===
 app.get('/products', async(req, res) =>{
   try {
      const price = req.query.price
      const rating = req.query.rating
     if(price || rating){
        const  products = await Product.find(
         {$or: [{price:{$lt:300}}, {rating:{$gt:4}}]})
        res.status(200).send(products)
     }else{
       const products = await Product.find()
       res.status(200).send(products)
     }
   } catch (error) {
       res.status(500).send({message: error.message})
   }
 })


  

// ===get Product with short====
app.get('/products', async(req, res) =>{
    try {
       const products = await Product.find().sort({price : 1})
       if(products){
        res.status(200).send(products)
       }else{
          res.status(404).send({message : "product not found"})
       }
    } catch (error) {
        res.status(500).send({message: error.message})
    }
})



//===Product delete====
app.delete("/products/:id", async(req, res)=>{
  try{
    const id = req.params.id
    const product = await Product.deleteOne({_id : id})
    res.status(200).send(product)
  }catch(error){
    res.status(404).send({message: error.message})
  }

})



// ==== product Update ====
app.put("/product/:id", async(req, res)=>{
  try{
   const id = req.params.id
   const product = await Product.updateOne({_id: id},
    {
      $set:{
        price : 500
      }
    })
    res.status(200).send(product)
  }catch(error){
    res.status(404).send({message: error.message})

  }
})






app.listen(port, async () => {
  console.log('server is running')
  await connectionDB()
})

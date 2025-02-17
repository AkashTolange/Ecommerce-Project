const port = process.env.PORT || 4000;
const express =require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

// Load environment variables
require('dotenv').config();

//what this for man
const { type } = require('os');

app.use(express.json());~
app.use(cors());

//Database connection with mongodb
// mongoose.connect("mongodb+srv://akashhtolangee77:aC9WMFYgb7hzxeKa@cluster0.5mh1h.mongodb.net/e-commerce")
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });


//api creation

app.get("/", (req, res) => {
    res.send("Express app is running on backend")
})


//image storage engine
const storage = multer.diskStorage({
    destination: './upload/images', //add a comma here too ok
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload =multer({storage:storage})


// creating upload endpoint for images

app.use('/images', express.static('upload/images'))
app.post("/upload",upload.single('product'), (req, res)=>{
    res.json({
        success:1, //add a comma here ok
       
        image_url: `https://ecommerce-project-zeg6.onrender.com/images/${req.file.filename}`  // Update with the deployed URL
    })
})

// schema for creating products

const Product = mongoose.model("Product", {
    id:{
        type: Number,
        required: true,
        unique: true,
    },
    name:{
        type:String,
        required: true,
    },
    image:{
        type:String,
        required: true,
    },
    category:{
        type:String,
        required: true,
    },
    new_price:{
        type:Number,
        required: true,
    },
    old_price:{
        type:Number,
        required: true,
    },
    data:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    },

});

//
app.post('/addproduct', async (req, res) => {
    try {
        //id will be automatically generated in db
        let products = await Product.find({});
        let id;
        if(products.length>0){
            let last_product_array = products.slice(-1);
            let last_product = last_product_array[0];
            id = last_product.id + 1;
        }else{ 
            id=1;
        }
        // Create a new product object
        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
        });

        // Save the product to the database
        console.log(product);
        await product.save();
        console.log("Product saved successfully");

        // Send a success response
        res.json({ 
            success: true,
            name: req.body.name,
        });

    } catch (error) {
        console.error("Error:", error.message);
        
        // Send an error response
        res.status(400).json({
            success: false, 
            message: error.message
        });
    }
});

// creating API  for deleting products
app.post('/removeproduct', async(req, res)=>{ 
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");

    res.json({ 
        success: true,
        name: req.body.name
    })
});

//creating api for getting all products
app.get('/allproducts', async( req, res)=>{ 
    //saving all proudcts in one array
    let products = await Product.find({});
    console.log("all products fetched");
    //respond for frontedn
    res.send(products);
});

//user schema 
//schema creating for user model

const Users = mongoose.model('Users', { 
    name:{ 
        type:String,
    
    }, 
    email:{
        type:String, 
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{ 
        type:Object,
    },
    data:{ 
        type:Date,
        default:Date.now,
    }
})


//creating endpoint for regstering the user
app.post('/signup', async (req, res) => {

    let check = await Users.findOne({email:req.body.email});
    if (check) {
        return res.status(400).json({success:false, errors:"existing user found with same email address"});
        
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i]=0;        
    }

    const user =new Users({ 
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })
    
    await user.save();

    const data = { 
        user:{ 
            id:user.id
        }
    }

    //to create token
    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success:true,token})
})

//creating endpoint for user login
app.post('/login', async (req,res) => {
    let user = await Users.findOne({email:req.body.email});
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data ={ 
                user: { 
                    id:user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({ success:true, token});
            
        }
        else{
            res.json({ success:false, errors:"wrong password"});
        }
        
    }
    else{ 
        res.json({ success:false, errors:"Wrong Email Id"});
    }
    
})

//creating endpoint for new collection data
app.get('/newcollections', async (req, res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection fetched");
    res.send(newcollection);
    
});

//creating endpoint for popular in women section
app.get('/popularinwomen', async (req, res) => {
    let products = await Product.find({category:"women"})
    let popular_in_women = products.slice(0,4);
    console.log("popular in women fetched");
    res.send(popular_in_women);
    
});

//creating endpoint for adding  product in cartdata

app.post('/addtocart', async (req,res) => {
    console.log(req.body);
})


app.listen(port, (error)=>{ 
    if(!error) {
        console.log("server running on Port" +port)
    }
    else {
        console.log("error : " +error)
    }
});


const express = require('express');
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');
const path = require('path');

const employeeRoutes = require('./routes/employeeRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes= require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');


const app = express();
app.use(cors());
app.use(bodyparser.json({limit: "50mb", }));

const PORT = process.env.PORT || 5000 ;

dotEnv.config();


mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("mongoDB connected successfully...");
})
.catch((error)=>{
    console.log(`${error}`);
});

app.use('/uploads',express.static(path.join(__dirname,'uploads')));

app.use('/employees',employeeRoutes);  
app.use('/api/auth',authRoutes);         // Authentication Routes    
app.use('/api/users',userRoutes);           //  User Management Routes    
app.use('/products',productRoutes);
app.use('/cart',cartRoutes);
app.use('/order',orderRoutes);

app.listen(PORT, ()=>{
    console.log(`server started and running at ${PORT}`)
});
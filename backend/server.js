const express=require('express');
const cors=require('cors');
const app=express();
require('dotenv').config();
const auth=require('./routes/authRoutes');
const mongoose=require('mongoose');

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
const mongoURI=process.env.MONGO_URI;

app.use('/auth',auth);

mongoose.connect(mongoURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>console.log("MongoDB Connected"))
.catch(e=>console.log("MongoDB connection error:",e));

app.listen(port,()=>
{
    console.log(`Server is running at port ${port}`);
});
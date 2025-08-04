const User=require('../models/User');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');

exports.signup= async (req,res) =>{
    try{
    console.log("📥 Received signup data:", req.body);
    const{name,email,password}=req.body;

    if(!name || !email || !password)
        return res.status(400).json({msg:"All Fields Are Required"});

    const hashed=await bcrypt.hash(password,10);
    const existing=await User.findOne({email});
    if(existing)
        return res.status(400).json({msg:"email Already Exists"});

    const user=await User.create({name,email,password:hashed});

    const token=jwt.sign({id:user._id, name:user.name},process.env.JWT_SECRET,{expiresIn:'7D'});
    res.json({token,
         user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
}
catch(err)
{
    return res.status(500).json({msg:"Server Error",error:err.message});
}

};

exports.login = async(req,res) => {
    try{
        console.log("Login details :",req.body);
    const{email,password}=req.body;

    if(!email || !password)
        return res.status(400).json({msg:"All Fields Are Required"});


    const user= await User.findOne({email});
    if(!user || !(await bcrypt.compare(password,user.password)))
        return res.status(400).json({msg:"Invalid Credentials"});

    const token=jwt.sign({id:user._id, name:user.name},process.env.JWT_SECRET,{expiresIn:'7D'});
    res.json({token,
         user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
}
catch(err)
{
    return res.status(500).json({msg:"Server Error",error:err.message});
}

};
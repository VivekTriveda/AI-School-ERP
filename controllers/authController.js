const bcrypt=require("bcryptjs");

const Admin=require("../models/Admin");

const Principal=require("../models/Principal");


// ================= ADMIN REGISTER =================

exports.registerAdmin=async(req,res)=>{

try{

const{

fullName,
email,
mobile,
username,
password

}=req.body;

const exists=await Admin.findOne({

$or:[
{email},
{username}
]

});

if(exists){

return res.json({

success:false,

message:"Admin already exists"

});

}

const hash=await bcrypt.hash(password,10);

const admin=await Admin.create({

fullName,
email,
mobile,
username,
password:hash

});

res.json({

success:true,

message:"Admin Created",

admin

});

}catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};



// ================= ADMIN LOGIN =================

exports.loginAdmin=async(req,res)=>{

try{

const{

username,
password

}=req.body;

const admin=await Admin.findOne({

username

});

if(!admin){

return res.json({

success:false,

message:"Invalid Username"

});

}

const match=await bcrypt.compare(

password,
admin.password

);

if(!match){

return res.json({

success:false,

message:"Wrong Password"

});

}

res.json({

success:true,

admin

});

}catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

};
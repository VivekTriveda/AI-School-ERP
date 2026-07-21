const express=require("express");

const router=express.Router();

const{

registerAdmin,
loginAdmin

}=require("../controllers/authController");

const {
    loginPrincipal
} = require("../controllers/principalController");


router.post("/admin/register",registerAdmin);

router.post("/admin/login",loginAdmin);

router.post("/principal/login", loginPrincipal);

module.exports=router;
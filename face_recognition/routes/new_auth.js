var express = require("express");
var router = express.Router();
const bcrypt = require('bcrypt');
const { check,validationResult } = require("express-validator");
const {userSignin} = require("../requests/userSignin");
const {adminSignin}=require('../requests/adminSignin')
const {register}=require('../requests/register')
const {detectFaces}=require('../requests/detectFaces')
// const {recognizer}=require('../requests/recognizer')
const {checkauth}=require('../requests/checkauth')
const salt = 10;

//user and admin signin route
router.post("/signin/user",(req,res)=>{
   userSignin(req,res,db,bcrypt)
})
router.post("/signin/admin",(req,res)=>{
    adminSignin(req,res,db)
})



// new user registration route
router.post("/registration",
[      
    check("firstname","first name should comtain alphabets only").isAlpha(),
    check("lastname","last name should contain alphabets only").isAlpha(),
    check("email","require a valid email").isEmail(),
    check("phonenumber","should contain 10 numeric values").isLength({ min: 10, max: 11 }).isNumeric(),
],
(req,res)=>{
   register(req,res,bcrypt,db,salt,validationResult);
})



//updating fields in a record
router.patch("/update",checkauth,(req,res)=>{
    console.log(req.body)
    const {addressline1,addressline2,phonenumber,designation}=req.body
    let sql="UPDATE employeedata SET addressline1=?,addressline2=?, phonenumber=?, designation=? WHERE email=?";
    db.query(sql,[addressline1,addressline2,phonenumber,designation,EMAIL],(err,result)=>{
        if(err)
        console.log(err);
        else
        res.json("Updated Successfully");  
    })
})


//admin dashboard route

router.get("/admindashboard",(req,res)=>{
    let sql="SELECT firstname,lastname,designation,phonenumber FROM employeedata ";
    
    db.query(sql,(err,result)=>{
        if(err)
        {
            console.log(err)
        }
        else
        {
            res.send(result)
        }
    })
})
//single user log details
router.get("/userlogdetails",checkauth,(req,res)=>{
    let sql=`select name,designation,logindate,logintime,logindetails from login_details,employeedata where 
    login_details.email=employeedata.email
    and login_details.email='${EMAIL}'` 

    db.query(sql,(err,result)=>{
        if(err)
        {
            console.log(err)
        }
        else{
            res.send(result)
        }
    })
})
// all user log details
router.get("/alllogdetails",(req,res)=>{
    let sql=" select name,designation,logindate,logintime,logindetails from login_details,employeedata where login_details.email=employeedata.email;"
    db.query(sql,(err,result)=>{
        if(err)
        {
            console.log(err)
        }
        else{
            res.send(result)
        }
    })
})

router.post('/detectFaces',(req,res)=>{
    detectFaces(req,res)
    })

// router.get('/recognizeFaces',(req,res)=>{
//    recognizer(req,res);
// })

module.exports = router;


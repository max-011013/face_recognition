var express = require("express");
var router = express.Router();
var jwt=require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

//Authentication middleware
function checkauth(req,res,next)
{
    try{
        const token=req.headers.authorization.split(" ")[1];
        var decoded=jwt.verify(token,"secret")
        global.EMAIL=decoded.email;
        next();
    }
    catch(error){
        return res.status(401).json({
            message:"Auth failed"
        })
    }
}

//user and admin signin route
router.post("/signin",(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    let sql="SELECT * FROM employeedata WHERE email=?";
    db.query(sql,[email],function(err,result){
        if(err){
            console.log(err);
        }
        else{
            if(result.length>0)
            {
                if(password==result[0].password)
                {
                    let sqlquery1="INSERT INTO logintimestamp(firstname,lastname,designation,phonenumber,email,logintime,logindate,isadmin,logindetails) VALUES(?)"
                   // let date=Date.now()
                    let today=new Date()
                    let time= today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();
                    let date=today.getDate()+"-"+today.getMonth()+"-"+today.getUTCFullYear();
                    let values=[result[0].firstname,result[0].lastname,result[0].designation,result[0].phonenumber,result[0].email,time,date,result[0].isadmin,"Face-Id:Fails - User-Id:Success"]
                    db.query(sqlquery1,[values],(err,res)=>{
                        if(err)
                             console.log(err);
                        else
                            console.log("successfully added logindetails");
                    })
                    
                    var token=jwt.sign({
                        email:email
                        },"secret",
                        {
                            expiresIn:"3h"
                    })
                
                    console.log("Authentication successful")
                    res.json({
                        token:token
                    })
                }
            }
        }
    })
})



//new user registration route
router.post("/registration",
checkauth,[      
    check("firstname","first name should comtain alphabets only").isAlpha(),
    check("lastname","last name should contain alphabets only").isAlpha(),
    check("email","require a valid email").isEmail(),
    check("phonenumber","should contain 10 numeric values").isLength({ min: 10, max: 11 }).isNumeric(),
],(req,res)=>{
   const errors = validationResult(req);
   if(!errors.isEmpty())
    {
        return res.status(422).json({
            error:errors.array()[0].msg
        })
    }
    else{
        console.log("success");
    }

    let data=req.body;
    //you can update the queries according to your new database
    let sql1="INSERT INTO employeedata (firstname,lastname,dob,gender,addressline1,addressline2,email,phonenumber,designation,isadmin,password) VALUES (?)" ;
    let values=[data.firstname,data.lastname,data.dob,data.gender,data.addressline1,data.addressline2,data.email,data.phonenumber,data.designation,0,data.password];
    db.query(sql1,[values],(err,result)=>{
        if(err)
            console.log(err);
        else
            console.log("successfully added record");
    })
})



//updating fields in a record
router.patch("/update",checkauth,(req,res)=>{
    let sql="UPDATE employeedata SET addressline1=?, addressline2=?,phonenumber=?, designation=? WHERE email=?";
    db.query(sql,[req.body.addressline1,req.body.addressline2,req.body.phonenumber,req.body.designation,EMAIL],(err,result)=>{
        if(err)
        console.log(err);
        else
        console.log("successfully record updated");  
    })
})


//admin dashboard route

router.get("/admindashboard",checkauth,(req,res)=>{
    let sql="SELECT firstname,lastname,designation,phonenumber FROM logintimestamp ORDER BY serialno DESC";
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


//admin log details

router.get("/adminlogdetails",checkauth,(req,res)=>{
    let sql="SELECT logindetails,logindate,logintime FROM logintimestamp WHERE email=EMAIL ORDER BY serialno DESC"
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

//user log details
router.get("/userlogdetails",checkauth,(req,res)=>{
    let sql="SELECT logindetails,date,time FROM logintimestamp WHERE email=EMAIL ORDER BY serialno DESC"
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
module.exports = router;


//logintimes
//employee data
var jwt=require("jsonwebtoken");

const adminSignin=(req,res,db)=>{

    
    const email=req.body.email;
    const password=req.body.password;
    console.log(req.body)
    let sql="SELECT * FROM admin WHERE email=?";
    db.query(sql,[email],function(err,result){
        
        if(err){
            console.log(err);
        }
        else{
            if(result.length>0)
            {
                if(password===result[0].password)
                {
                    var token=jwt.sign({
                        email:email
                    },"secret",
                    {
                        expiresIn:"3h"
                    })
                    console.log("Authentication successful")
                    res.json({
                        token:token,
                        result
                    })
                }
                else{
                    res.status(404).json({
                        result:'wrong password'
                    })
                }
            }
        }
    })
    }
    module.exports={
        adminSignin
    }
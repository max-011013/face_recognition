var jwt=require("jsonwebtoken");

const userSignin=(req,res,db,bcrypt)=>{
 const email=req.body.email;
    const password=req.body.password;
    console.log(req.body)
    let sql="SELECT * FROM employeedata WHERE email=?";
    db.query(sql,[email],function(err,result){
        const pass = bcrypt.compareSync(password, result[0].password); // true
        if(err){
            console.log(err);
        }
        else{
            if(result.length>0)
            {
                if(pass)
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
    userSignin
}
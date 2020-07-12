var jwt=require("jsonwebtoken");




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
module.exports={
    checkauth
}


const register =(req,res,bcrypt,db,salt,validationResult)=>{
    console.log(req.body)
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
    const {password,firstname,lastname,dob,gender,addressline1,
        addressline2,email,phonenumber,designation}  = data
        const hash = bcrypt.hashSync(password, salt);
    //you can update the queries according to your new database
    let sql1="INSERT INTO employeedata (firstname,lastname,dob,gender,addressline1,addressline2,email,phonenumber,designation,password) VALUES (?)" ;
    let values=[firstname,lastname,dob,gender,addressline1,addressline2,email,phonenumber,
        designation,hash];
        db.query(sql1,[values],(err,result)=>{
            if(err)
            console.log(err);
            else
            res.json("Registration Successfull");
        })
    }
    module.exports={
        register
    }
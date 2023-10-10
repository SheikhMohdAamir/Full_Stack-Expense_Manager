const express=require('express')
const app=express()
const cors=require('cors')
const bodyparser=require('body-parser')
const userTable=require('./userTable')
const sequelize=require('./database/sql')
app.use(cors())
app.use(bodyparser.json())
app.post('/user/signup',async(req,res,next)=>{
    const {email,name,password} = req.body
    if(email.length===0 || name.length===0 || password.length===0){
        return res.status(500).json({message:'Input Field Cannot Be Empty'})
    }
    const findUser=await userTable.findOne({
        where:{email:req.body.email}
    })
    if(findUser!==null){
        console.log('User Alredy Exists')
        res.status(500).json({message:'Already Exists'})
    }
    else{
        console.log('New User')
        const postUser = await userTable.create({email:req.body.email,name:req.body.name,password:req.body.password})
        res.status(201).json({message:'POST Request Successfull',data:postUser})
    }
})
sequelize.sync().then(()=>{
    app.listen(9000,()=>{console.log('SERVER RUNNING AT PORT 9000')});
    console.log('Synced')
}).catch(err=>{
    console.log(err)
})

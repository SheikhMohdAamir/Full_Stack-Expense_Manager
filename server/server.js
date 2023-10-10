const express=require('express')
const app=express()
const cors=require('cors')
const bodyparser=require('body-parser')
const userTable=require('./userTable')
const sequelize=require('./database/sql')
app.use(cors())
app.use(bodyparser.json())
app.post('/user/signup',async(req,res,next)=>{
    console.log(req.body)
    const findUser=await userTable.findOne({
        where:{email:req.body.email}
    })
    console.log(findUser)
    if(findUser!==null){
        console.log('User Alredy Exists')
        res.json({response:'Already Exists'})
    }
    else{
        console.log('New User')
        const postUser = await userTable.create({email:req.body.email,name:req.body.name,password:req.body.password})
        res.json({reponse:'POST Request Successfull',data:postUser})
    }
})
sequelize.sync().then(()=>{
    app.listen(9000,()=>{console.log('SERVER RUNNING AT PORT 9000')});
    console.log('Synced')
}).catch(err=>{
    console.log(err)
})

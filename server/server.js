const express=require('express')
const app=express()
const cors=require('cors')
const bodyparser=require('body-parser')
app.use(cors())
app.use(bodyparser.json())
app.post('/user/signup',(req,res,next)=>{
    console.log(req.body)
    res.json({reponse:'POST Request Successfull'})
})
app.listen(9000,()=>{console.log('SERVER RUNNING AT PORT 9000')});
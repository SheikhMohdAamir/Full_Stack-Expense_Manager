const jwt=require('jsonwebtoken')
const userTable=require('../userTable')

const authenticate=async(req,res,next)=>{
    try{
        console.log('BODY', req.body)
        console.log("HEADER",req.header('Authorization'))
        const token=req.header("Authorization")
        console.log('IN MIDDLEWARE - TOKEN -',token)
        const userId=jwt.verify(token,'secretkey')
        console.log('IN MIDDLEWARE - USER_ID - ',userId.userId)
        const findId= await userTable.findByPk(userId.userId)
        console.log('FIND ID',findId)
        req.user=findId
        next()
    }
    catch(err){
        console.log('ERROR IN MIDDLEWARE',err)
    }
}

module.exports=authenticate
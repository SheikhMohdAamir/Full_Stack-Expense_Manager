const express = require("express");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const userTable = require("./table/userTable");
const table = require("./table/table");
const order = require("./table/order");
const sequelize = require("./database/sql");
const bcrypt = require("bcrypt");
const generateToken = require("jsonwebtoken");
const authenticate = require("./middleware/middleware");
const Razerpay = require("razorpay");
const key = "secretkey";
app.use(cors());
app.use(bodyparser.json());
app.post("/user/signup", async (req, res, next) => {
  const { email, name, password } = req.body;
  if (email.length === 0 || name.length === 0 || password.length === 0) {
    return res.status(500).json({ message: "Input Field Cannot Be Empty" });
  }
  const findUser = await userTable.findOne({
    where: { email: req.body.email },
  });
  if (findUser !== null) {
    console.log("User Alredy Exists");
    res.status(500).json({ message: "Already Exists" });
  } else {
    try {
      bcrypt.hash(password, 10, async (err, hash) => {
        const postUser = await userTable.create({
          email: req.body.email,
          name: req.body.name,
          password: hash,
        });
        res.status(201).json({ message: "Signup Successful", data: postUser });
      });
    } catch (err) {
      res.status(500).json({ message: "Something Went Wrong" });
    }
  }
});
app.post("/user/login", async (req, res, next) => {
  const { email, password } = req.body;
  const findUserEmail = await userTable.findOne({
    where: { email: email },
  });
  if (findUserEmail === null) {
    return res.status(404).json({ message: "Email Does Not Exist" });
  } else {
    console.log("FIND USER VAL", findUserEmail);
    bcrypt.compare(
      password,
      findUserEmail.dataValues.password,
      (err, result) => {
        if (result === true) {
          console.log("Logged In With ID - ", findUserEmail.dataValues.id);
          return res.status(201).json({
            message: "User Login Successfull",
            token: generateToken.sign(
              { userId: findUserEmail.dataValues.id },
              key
            ),
          });
        } else if (err) {
          return res.status(500).json({ message: "Something Went Wrong" });
        } else {
          console.log("RESULT", result);
          return res.status(401).json({ message: "Incorrect Password" });
        }
      }
    );
  }
});
app.post("/home/post", authenticate, async (req, res, next) => {
  const t = await sequelize.transaction()
  console.log(">>>>>>>>>>>>>", req.body);
  console.log(">>>>>>>>>>>>>", req.user.dataValues.id)
  const id = req.user.dataValues.id;
  let sum=req.user.dataValues.totalexpense + Number(req.body.amount)
  try {
    const one=table.create({
      amount: req.body.amount,
      description: req.body.description,
      category: req.body.category,
      userId: id,
    },{transaction:t});
    const two=userTable.update({totalexpense:sum},{where:{id:id},transaction:t})
    await Promise.all([one,two])
    await t.commit()
    res.json({ message: "Expenses Added" })
  } catch (err) {
    await t.rollback()
    res.status(500).json({ message: "Something Went Wrong" });
  }
});
app.get("/home/get", authenticate, async (req, res, next) => {
  console.log("BODY", req.user);
  try {
    const getExpenses = await table.findAll({
      where: { userId: req.user.dataValues.id },
    });
    res.json({ expenses: getExpenses });
  } catch (err) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
});
app.post("/home/delete", authenticate, async (req, res, next) => {
  const t = await sequelize.transaction()
  console.log("BODY", req.body);
  console.log("ID", req.user.dataValues.id);
  const id = req.body.id;
  const userId = req.user.dataValues.id;
  const min=req.user.dataValues.totalexpense - Number(req.body.amount)
  console.log('MIN--------->>>>>>>>>>>>>>>',req.user.dataValues.totalexpense,req.body.amount)
  try {
    const del = await table.findByPk(id);
    await del.destroy({ where: { userId: userId } });
    await userTable.update({totalexpense:min},{where:{id:req.user.dataValues.id}})
    await t.commit()
    res.json({ message: "Expense Successfully Deleted" });
  } catch (err) {
    await t.rollback()
    res.status(500).json({ message: "Expense Not Deleted" });
  }
});
app.get("/purchasepremium", authenticate, async (req, res, next) => {
  try {
    var rp = new Razerpay({
      key_id: "rzp_test_lnEHzvnyJbs8mu",
      key_secret: "ALZLZ5M4pTHVcCLCyqhvWIJo",
    });
    const amount = 2500;
    rp.orders.create({ amount, currency: "INR" }, async (err, order) => {

        console.log("ORDER ID>>>>>", order.id);
        await req.user.createOrder({order_id:order.id,status:'PENDING'})
        res.status(201).json({ order, key_id: rp.key_id });
      
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something Went Wrong" });
  }
});
app.post("/updatetransactionstatus", authenticate, async(req,res,next)=>{
  try{
    const {payment_id,order_id} = req.body
    console.log('ORDER_ ID--------',order_id)
    console.log('USER----------',req.user)
    const finduser=await order.findOne({where:{order_id:order_id}})
    console.log('FINDUSER--------',finduser)

    const one=finduser.update({payment_id:payment_id,status:'SUCCESSFUL'})
    console.log('AFTER 1st UPDATE--------',req.user.dataValues)
    const two=req.user.update({ispremium:true})
    await Promise.all([one,two])
    res.status(202).json({success:true,message:'Transaction Successful'})
  }
  catch(err){
    console.log(err)
  }
})
app.get("/transactionfailed",authenticate,async(req,res,next)=>{
  console.log('FAILED>>>>>>>',req.user)
  const user=await order.findOne({where:{userId:req.user.dataValues.id}})
  await user.update({status:"FAILED"})
  res.status(403).json('FAILED')
  
})
app.get('/checkifpremium',authenticate, async(req,res,next)=>{
  console.log('CHECKING????????????????',req.user)
  if(req.user.dataValues.ispremium===true){
    return res.json({message:'PREMIUM MEMBER'})
  }
  else{
    return res.json({message:'NOT A PREMIUM MEMBER'})
  }
})
app.get('/premiummember',authenticate,async(req,res,next)=>{
  const leaderboardData= await userTable.findAll({order:[['totalexpense','DESC']]})
  res.status(201).json({LeaderboardData:leaderboardData})
})
userTable.hasMany(table);
table.belongsTo(userTable);

userTable.hasMany(order)
order.belongsTo(userTable)

sequelize
  .sync()
  .then(() => {
    app.listen(9000, () => {
      console.log("SERVER RUNNING AT PORT 9000");
    });
    console.log("Synced");
  })
  .catch((err) => {
    console.log(err);
  });

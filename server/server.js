const express = require("express");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const userTable = require("./userTable");
const sequelize = require("./database/sql");
const bcrypt = require("bcrypt");
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
    console.log("New User");
    bcrypt.hash(password, 10, async (err, hash) => {
      const postUser = await userTable.create({
        email: req.body.email,
        name: req.body.name,
        password: hash,
      });
      res
        .status(201)
        .json({ message: "POST Request Successfull", data: postUser });
    });
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
          console.log("RESULT", result);
          return res.status(201).json({ message: "User Login Successfull" });
        }else if(err){
          return res.status(500).json({message:"Something Went Wrong"})
        }
        else{
          console.log("RESULT", result);
          return res.status(401).json({ message: "Incorrect Password" });
        }
      }
    );
  }
});
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

const express = require("express");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const userTable = require("./userTable");
const table = require("./table");
const sequelize = require("./database/sql");
const bcrypt = require("bcrypt");
const generateToken = require("jsonwebtoken");
const authenticate = require("./middleware/middleware");
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
    })
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
  console.log(">>>>>>>>>>>>>", req.body);
  console.log(">>>>>>>>>>>>>", req.user.dataValues.id);
  const id = req.user.dataValues.id;
  try {
     await table.create({
      amount: req.body.amount,
      description: req.body.description,
      category: req.body.category,
      userId: id,
    });
    res.json({ message: "Expenses Added" });
  } catch (err) {
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
  console.log("BODY", req.body);
  console.log("ID", req.user.dataValues.id);
  const id = req.body.id;
  const userId = req.user.dataValues.id;
  try {
    const del = await table.findByPk(id);
    del.destroy({ where: { userId: userId } });
    res.json({ message: "Expense Successfully Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Expense Not Deleted" });
  }
});

userTable.hasMany(table);
table.belongsTo(userTable);

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
  })
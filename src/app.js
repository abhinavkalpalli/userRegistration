const express = require("express");
const { MongoClient } = require('mongodb');
require("dotenv").config();
const app = express();
app.use(express.urlencoded());
app.use(express.json());
const bcrypt = require("bcryptjs");

const client = new MongoClient('mongodb://localhost:27017');
const user = client.db(process.env.DB_NAME).collection("users");

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  function valid(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }
  if (valid(email)) {
    const hashedPassword =await bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return;
      }
      console.log("Hashed password:", hash);
    });
    const newUser=await user.insertOne({
      username: username,
      email: email,
      password: hashedPassword,
    });
    res.status(201).json({message:'User is created',user:newUser})
  }else{
    res.status(400).json({message:'Email is not valid'})
  }
});
client.connect().then(() => {
  app.listen(3000, () => {
    console.log("App is running on 3000");
  });
});

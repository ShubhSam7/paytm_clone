const {User} = require("./db");
const jwt=require("jsonwebtoken");

const cors = require('cors')
const express = require("express");
const app = express();
const router = require('./routers/index')


app.use(express.json())
app.use(cors())
app.use('api/v1/', router)


app.listen(3000, () => {
  console.log("Server running on port 3000");
});
// app.js
const express = require('express');
const app = express();
const bodyParser = require("body-parser");

const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, ()=>{
    console.log(`running on port  ${port}`);
});

const mongoose = require("mongoose");
require("dotenv").config();

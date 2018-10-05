const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const passport = require('passport');
const app = express();

app.use(bodyParser.json())


app.get('/',(req, res)=>{
    res.send({status:"hello"})
})



app.listen(4000,()=>{
    console.log(`Port : ${4000}`)
})
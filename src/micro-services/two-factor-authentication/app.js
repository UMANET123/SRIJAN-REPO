const express = require('express');
const bodyParser  = require('body-parser');
const db = require('./config/db');
const router = require('./routes/index.router');
const environment = require('./config/environment');
const app = express();

db.create("redis://twofaredis",(error)=>{
    if(error){
        console.log(error);
    } else {
        console.log('Redis Server Running');
    }
});

app.use(bodyParser.json());
app.use('/',router)
app.listen(environment.PORT_NUMBER,()=>{
    console.log(`App running on port ${environment.PORT_NUMBER}`);
});

module.exports = app;
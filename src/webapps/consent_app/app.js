const express = require('express');
const app = express();
console.log('hello world')
app.listen(5560, () => {
    console.log(`Running on Port 5560`);
});


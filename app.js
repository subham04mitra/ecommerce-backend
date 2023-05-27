const express = require('express');

const bodyparser = require('body-parser');
const port = 8111;
const cors = require('cors');

const app = express();
app.use(cors())
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors())
const route = require('./Route/route');
app.use('/', route);
app.listen(port, (err) => {
    if (err) {
        console.log("Server Error");
    }
    console.log(`Server started at port ${port}.....`);
})
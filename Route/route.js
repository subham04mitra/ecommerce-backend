const spawn = require('child_process').spawn;
const axios = require('axios')
const express = require('express');
const route = express.Router();
const home = require('../API/routes/api_route');
route.use('/ecom', home);


module.exports = route;

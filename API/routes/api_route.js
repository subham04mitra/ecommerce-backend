const { request } = require('express');
const express = require('express');
const route = express.Router();

const verify = require('../../Middleware/authentication');
const control = require('../controller/controller');
route.post('/login', control.ulogin)
route.post('/login/logout', verify, control.ulogout);
route.post('/registration', control.uReg);
route.get('/user', verify, control.getallItem);
route.get('/user/:category', verify, control.getitembyCat);
route.get('/user/account/getorders', verify, control.getallOrders);
route.get('/user/getorders/:id', verify, control.getorderbyId);
route.post('/user/makeorder', verify, control.createOrder);
module.exports = route;


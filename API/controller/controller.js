const express = require('express');

const db = require('../../Serivce/dboperation');

let service = {};
service.ulogin = async (req, res) => {
    let data = req.body;
    try {
        let response = await db.ulogIn(data);
        if (response) {
            res.json(response);
        }
    } catch (err) {
        res.json(err)
    }
}
service.ulogout = async (req, res) => {
    let token = req.headers.token;
    try {
        let response = await db.ulogOut(token);
        if (response) {
            res.json({ response });
        }
    } catch (err) {
        res.json(err)
    }
}
service.uReg = async (req, res) => {
    let data = req.body;
    try {
        let response = await db.userRegistration(data);
        if (response) {
            res.json(response);
        }
    } catch (err) {
        res.json(err)
    }
}
service.getallItem = async (req, res) => {
    let page = req.query.page;
    let limit = req.query.limit;
    try {
        let response = await db.allItems(page, limit);
        if (response) {
            res.json(response);
        }
    } catch (err) {
        res.json(err)
    }
}
service.getitembyCat = async (req, res) => {
    let page = req.query.page;
    let limit = req.query.limit;
    let cat = req.params.category;
    let item = req.query.item;
    try {
        let response = await db.itembyCat(page, limit, cat, item);
        if (response) {
            res.json(response);
        }
    } catch (err) {
        res.json(err)
    }
}
service.getallOrders = async (req, res) => {
    let page = req.query.page;
    let limit = req.query.limit;
    let user = req.decode;
    try {
        let response = await db.allOrders(page, limit, user);
        if (response) {
            res.json(response);
        }
    } catch (err) {
        res.json(err)
    }
}
service.getorderbyId = async (req, res) => {

    let order = req.params.id;

    try {
        let response = await db.orderbyId(order);
        if (response) {
            res.json(response);
        }
    } catch (err) {
        res.json(err)
    }
}
service.createOrder = async (req, res) => {
    let user = req.decode;
    let order = req.body;

    try {
        let response = await db.postOrder(user, order);
        if (response) {
            res.json(response);
        }
    } catch (err) {
        res.json(err)
    }
}
module.exports = service;
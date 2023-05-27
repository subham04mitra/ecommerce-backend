const mongoose = require('mongoose');
const dict = require('./dictionary.json');
let schemas = {};
let schema = mongoose.Schema;

schemas.userSchema = () => {
    let userschema = new schema(dict.user)
    return userschema;
}
schemas.jwtSchema = () => {
    let jwtschema = new schema(dict.jwt)
    return jwtschema;
}
schemas.itemSchema = () => {
    let itemschema = new schema(dict.item)
    return itemschema;
}
schemas.orderSchema = () => {
    let orderschema = new schema(dict.order)
    return orderschema;
}

module.exports = schemas;
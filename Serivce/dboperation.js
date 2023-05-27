const jwt = require("jsonwebtoken");
const sch = require('../Table/schema')
const mongoose = require('mongoose');
const axios = require('axios');
const { log } = require("console");
const spawn = require('child_process').spawn;
function connect() {
    const url = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0";
    const connection = mongoose.createConnection(url,
        { useNewUrlParser: true, useUnifiedTopology: true })
    return connection;
}
let operation = {};


operation.ulogIn = async (data) => {
    return new Promise(async (resolve, reject) => {
        let conn = connect();
        let coll = conn.useDb('ecommerce');
        let userModel = coll.model("users", sch.userSchema());
        const user = await userModel.find({ email: data.Email, password: data.Password }, { _id: 0 });
        if (user.length != 0) {
            let coll1 = conn.useDb('ecommerce');
            let jwtModel = coll1.model("jwts", sch.jwtSchema());
            let jwtData = {
                name: user[0].name,
                email: user[0].email,
                Built_Time: new Date()
            }
            let token = jwt.sign(jwtData, "SECRETKEY", { expiresIn: "1h" });
            await jwtModel.insertMany({ token: token, name: user[0].name, Built_Time: new Date(), logout: false })
            conn.close();

            resolve({ Success: true, Message: "Login Successfull", Token: token, Data: user })
        }
        reject({ Success: false, Message: "No User Found" })
    });
};
operation.ulogOut = async (token) => {
    console.log("..............", token);
    return new Promise(async (resolve, reject) => {
        let conn = connect()
        let coll = conn.useDb('ecommerce')
        let jwtModel = coll.model("jwts", sch.jwtSchema())
        let updatedtoekn = await jwtModel.updateOne(
            { token: token },
            { $set: { logout: true } },
            { upsert: false }
        );
        if (updatedtoekn.modifiedCount != 0) {
            resolve({ Success: true, Message: "Logged Out Successfully" });
        } else {
            reject({ Success: false, Message: "Already Logged Out" });
        }
    });
};
operation.userRegistration = async (data) => {
    return new Promise(async (resolve, reject) => {
        let conn = connect();
        let coll = conn.useDb('ecommerce');
        let userModel = coll.model("users", sch.userSchema())
        try {
            let user = await userModel.insertMany(data);
            if (user.length != 0) {
                resolve({ Sccess: true, Message: "Patient Registered Succesfully", UserID: user[0].Email })
            }
        } catch (err) {
            reject({ Success: false, Message: "Registration Failed.", Error: "Email Already Registered" })
        }


    })
}
operation.allItems = async (page, limit) => {
    return new Promise(async (resolve, reject) => {
        let skipElements = page != undefined ? (page - 1) * limit : 0;
        let limitTo = limit != undefined ? limit : 20;
        let conn = connect();
        let coll = conn.useDb('ecommerce');
        let userModel = coll.model("items", sch.itemSchema());
        let itemData = await userModel.find({}, { _id: 0 }, { skip: skipElements, limit: limitTo });
        conn.close();
        if (itemData.length != 0) {
            resolve({
                Success: true, Data: itemData, pagination: {
                    page: page != undefined ? page : 1, limit: limit != undefined ? limit : 20
                }
            })
        }
        else {
            reject({ Success: false, Message: "DB operation failed" })
        }
    })
}
operation.itembyCat = async (page, limit, cat, item) => {
    console.log(item);
    return new Promise(async (resolve, reject) => {
        let skipElements = page != undefined ? (page - 1) * limit : 0;
        let limitTo = limit != undefined ? limit : 20;
        let conn = connect();
        let coll = conn.useDb('ecommerce');
        let userModel = coll.model("items", sch.itemSchema());
        let itemData = item != undefined ? await userModel.find({ category: cat, item_name: item }, { _id: 0 }, { skip: skipElements, limit: limitTo }) : await userModel.find({ category: cat }, { _id: 0 }, { skip: skipElements, limit: limitTo });
        conn.close();
        if (itemData.length != 0) {
            resolve({
                Success: true, Data: itemData, pagination: {
                    page: page != undefined ? page : 1, limit: limit != undefined ? limit : 20
                }
            })
        }
        else {
            reject({ Success: false, Message: "DB operation failed" })
        }
    })
}
operation.allOrders = async (page, limit, user) => {
    return new Promise(async (resolve, reject) => {
        let skipElements = page != undefined ? (page - 1) * limit : 0;
        let limitTo = limit != undefined ? limit : 20;
        let conn = connect();
        let coll = conn.useDb('ecommerce');
        let userModel = coll.model("orders", sch.orderSchema());
        let itemData = await userModel.find({ email: user.email }, { _id: 0 }, { skip: skipElements, limit: limitTo });
        conn.close();
        if (itemData.length != 0) {
            resolve({
                Success: true, Data: itemData, pagination: {
                    page: page != undefined ? page : 1, limit: limit != undefined ? limit : 20
                }
            })
        }
        else {
            reject({ Success: false, Message: "NO ORDERS" })
        }
    })
}
operation.orderbyId = async (order) => {
    return new Promise(async (resolve, reject) => {
        let conn = connect();
        let coll = conn.useDb('ecommerce');
        let userModel = coll.model("orders", sch.orderSchema());
        let itemData = await userModel.find({ _id: order }, { _id: 0 });
        conn.close();
        if (itemData.length != 0) {
            resolve({ Success: true, Data: itemData })
        }
        else {
            reject({ Success: false, Message: "NO ORDERS" })
        }
    })
}
operation.postOrder = async (user, order) => {

    return new Promise(async (resolve, reject) => {
        let conn = connect();
        let coll = conn.useDb('ecommerce');
        let userModel = coll.model("orders", sch.orderSchema());
        let itemmodel = coll.model("items", sch.itemSchema());
        let itemData = await itemmodel.find({ item_name: order.item });

        let orderData = {
            email: user.email,
            address: order.shipping_address,
            item_name: order.item,
            price: itemData[0].price,
            category: itemData[0].category,
            date: new Date().toString().slice(0, 10)
        }
        let newOrder = await userModel.insertMany(orderData);

        conn.close();
        if (newOrder.length != 0) {
            resolve({ Success: true, Message: "Order Placed", OrderId: newOrder[0]._id, Amount: newOrder[0].price })
        }
        else {
            reject({ Success: false, Message: "NO ORDERS" })
        }
    })
}





module.exports = operation;


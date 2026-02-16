const Razorpay = require('razorpay');
const dotenv = require("dotenv");
const { sendNewPurchaseAlert } = require('../utils/discordWebhook');
dotenv.config({ path: "../.env" })

var instance = new Razorpay({
    key_id: process.env.RAZORPAY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
    const { amount ,currency} = req.body;
    const data = await instance.orders.create({
        amount: amount * 100,
        currency: currency,
        receipt: "receipt#1",
        notes: {
            key1: "value3",
            key2: "value2"
        }
    })
    sendNewPurchaseAlert({ customerName: "New Customer", orderId: data.id, total: amount, items: "NEW ORDER From Store"  })

    res.json({ "data": data })
}
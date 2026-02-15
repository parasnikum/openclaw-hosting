const Razorpay = require('razorpay');
const dotenv = require("dotenv")
dotenv.config({ path: "../.env" })

var instance = new Razorpay({
    key_id: process.env.RAZORPAY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
    const { amount } = req.body;
    const data = await instance.orders.create({
        amount: amount * 100,
        currency: "USD",
        receipt: "receipt#1",
        notes: {
            key1: "value3",
            key2: "value2"
        }
    })
    res.json({ "data": data })
}
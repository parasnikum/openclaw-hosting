const Razorpay = require('razorpay');

var instance = new Razorpay({
    key_id: 'rzp_test_SEW6QmBtngxN1O',
    key_secret: 'v0bjd1V625sMXzYbc0Jy6SVc',
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
    console.log("Create Order: ", data);
    res.json({ "data": data })
}
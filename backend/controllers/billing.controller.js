const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const razorpay = new Razorpay({
    key_id: 'rzp_test_SEW6QmBtngxN1O',
    key_secret: 'v0bjd1V625sMXzYbc0Jy6SVc',
});

const {config} = require("dotenv");
const path = require('path');
config({ path: path.resolve(__dirname, "../.env") });
/**
 * RENEW SERVICE
 * logic: verify plan -> update service date -> create transaction -> create invoice
 */
exports.createRenewalOrder = async (req, res) => {
    try {
        const { planId, serviceId } = req.body;

        const planRes = await pool.query('SELECT price FROM plans WHERE id = $1', [planId]);
        if (planRes.rows.length === 0) return res.status(404).json({ msg: "Plan not found" });

        const amount = Math.round(planRes.rows[0].price * 100); // Razorpay works in paise

        const options = {
            amount,
            currency: "INR",
            receipt: `renew`,
            notes: { serviceId, planId, userId: req.user.userid }
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ error: "Order creation failed" });
    }
};

/**
 * 2. VERIFY PAYMENT & UPDATE DB (The logic you originally had)
 */
exports.verifyRenewalPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, serviceId, planId } = req.body;
    const user_id = req.user.userid;

    // Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ msg: "Invalid payment signature" });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const planRes = await client.query('SELECT price FROM plans WHERE id = $1', [planId]);
        const { price } = planRes.rows[0];

        // Update Service Date
        const updateServiceQuery = `
            UPDATE services 
            SET renewal_date = CASE 
                WHEN renewal_date > NOW() THEN renewal_date + INTERVAL '30 days'
                ELSE NOW() + INTERVAL '30 days'
            END,
            status = 'Active'
            WHERE id = $1 AND user_id = $2
            RETURNING renewal_date
        `;
        const serviceUpdate = await client.query(updateServiceQuery, [serviceId, user_id]);

        // Log Transaction
        await client.query(
            `INSERT INTO transactions (transaction_id, service_id, user_id, price, payment_mode, status, order_id, gateway) 
             VALUES ($1, $2, $3, $4, 'Razorpay', 'Paid', $5, 'Razorpay')`,
            [razorpay_payment_id, serviceId, user_id, price, razorpay_order_id]
        );

        // Create Invoice
        await client.query(
            `INSERT INTO invoices (id, service_id, user_id, price, status, expiry_date) 
             VALUES ($1, $2, $3, $4, 'Paid', $5)`,
            [uuidv4(), serviceId, user_id, price, serviceUpdate.rows[0].renewal_date]
        );

        await client.query('COMMIT');
        res.status(200).json({ status: "Success", msg: "Service Renewed!" });
    } catch (error) {
        await client.query('ROLLBACK');
        console.log(err);
        res.status(500).json({ error: "DB Update Failed" });
    } finally {
        client.release();
    }
};

/**
 * GET USER TRANSACTIONS
 */
exports.getMyTransactions = async (req, res) => {
    try {
        const user_id = req.user.userid;
        const result = await pool.query(
            `SELECT t.*, s.service_name 
             FROM transactions t
             LEFT JOIN services s ON t.service_id = s.id
             WHERE t.user_id = $1 
             ORDER BY t.created_at DESC`,
            [user_id]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * GET USER INVOICES
 */
exports.getMyInvoices = async (req, res) => {
    try {
        const user_id = req.user.userid;
        const result = await pool.query(
            `SELECT i.*, s.service_name 
             FROM invoices i
             JOIN services s ON i.service_id = s.id
             WHERE i.user_id = $1 
             ORDER BY i.expiry_date DESC`,
            [user_id]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
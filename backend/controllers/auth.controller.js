const pool = require('../config/db'); // Your pg pool connection
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";

const sendProEmail = require('../helpers/mailHelper');

const sendMailLogic = async (email, userId, username) => {
    try {
        const token = uuidv4();
        const now = new Date();

        // Update DB
        await pool.query(
            `UPDATE verification SET verification_token = $1, last_send_at = $2 WHERE user_id = $3`,
            [token, now, userId]
        );

        // Define the variables for the template
        const placeholders = {
            username: username,
            link: `https://zyroxhosting.in/verify?token=${token}`,
            year: new Date().getFullYear()
        };

        // Send using the helper
        const result = await sendProEmail(email, "Action Required: Verify Your Account", "welcome.html", placeholders);

        return result.success;
    } catch (err) {
        console.error("sendMailLogic Error:", err);
        return false;
    }
};
exports.register = async (req, res) => {
    console.log(req.body);
    const client = await pool.connect();
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) return res.status(400).json({ msg: "All fields required" });

        await client.query('BEGIN');

        const userCheck = await client.query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]);
        if (userCheck.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ msg: "Email or Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        await client.query(
            'INSERT INTO users (id, username, email, password, created_at) VALUES ($1, $2, $3, $4, NOW())',
            [userId, username, email, hashedPassword]
        );

        await client.query(
            'INSERT INTO verification (id, user_id) VALUES ($1, $2)',
            [uuidv4(), userId]
        );

        await client.query('COMMIT');

        // 4. Send initial verification email
        await sendMailLogic(email, userId, username);

        return res.status(201).json({ status: "Success", msg: "Registered. Please verify your email." });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Register Error:", error);
        return res.status(500).json({ error: "Server error during registration" });
    } finally {
        client.release();
    }
};

/**
 * LOGIN
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
        const user = result.rows[0];

        if (!user) return res.status(404).json({ msg: "User not found" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

        // IMPORTANT: Verification Check
        if (!user.is_verified) {
            return res.status(403).json({ isVerified: false, msg: "Please verify your email before logging in." });
        }

        const token = jwt.sign(
            { userid: user.id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: "2d" }
        );

        console.log(token);

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 24 * 60 * 60 * 1000,
            path: "/",
        });
        return res.status(200).json({ token, status: "Logged in successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Login failed" });
    }
};

/**
 * SEND / RESEND VERIFICATION EMAIL
 */
exports.sendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const query = `
            SELECT u.id, u.username, u.is_verified, v.last_send_at 
            FROM users u
            JOIN verification v ON u.id = v.user_id
            WHERE u.email = $1
        `;
        const result = await pool.query(query, [email.toLowerCase()]);
        const user = result.rows[0];

        if (!user) return res.status(404).json({ msg: "User not found" });
        if (user.is_verified) return res.status(400).json({ msg: "User already verified" });

        // Check Cooldown (1 hour)
        if (user.last_send_at) {
            const diffInMs = new Date() - new Date(user.last_send_at);
            const oneHour = 60 * 60 * 1000;

            if (diffInMs < oneHour) {
                const minsLeft = Math.ceil((oneHour - diffInMs) / (60 * 1000));
                return res.status(429).json({ msg: `Wait ${minsLeft} minutes before resending.` });
            }
        }

        const sent = await sendMailLogic(email, user.id, user.username);
        if (sent) {
            return res.status(200).json({ msg: "Verification email sent successfully" });
        } else {
            return res.status(500).json({ msg: "Failed to send email" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
};

/**
 * LOGOUT
 */
exports.logout = (req, res) => {
    res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        domain: ".zyroxhosting.in"
    });
    return res.status(200).json({ status: "Logged out" });
};
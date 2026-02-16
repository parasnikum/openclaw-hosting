const pool = require('../config/db'); // Your pg pool connection
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";

const sendProEmail = require('../helpers/mailHelper');

const sendMailLogic = async (email, userId, placeholders) => {
    try {
        const now = new Date();
        await pool.query(
            `UPDATE verification SET verification_token = $1, last_send_at = $2 WHERE user_id = $3`,
            [placeholders.token, now, userId]
        );
        const result = await sendProEmail(email, "Action Required: Verify Your Account", "verifyEmail.html", placeholders);
        return result.success;
    } catch (err) {
        console.error("sendMailLogic Error:", err);
        return false;
    }
};


const generateEmailVerificationToken = (userId, email) => {
    return jwt.sign(
        {
            userId,
            email,
            type: 'email-verification'
        },
        process.env.JWT_EMAIL_SECRET,
        {
            expiresIn: '30m'
        }
    );
};


exports.register = async (req, res) => {
    const client = await pool.connect();
    try {
        const { username, email, password, last_name, first_name } = req.body;

        if (!username || !email || !password || !last_name || !first_name) return res.status(400).json({ msg: "All fields required" });

        await client.query('BEGIN');

        const userCheck = await client.query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]);
        if (userCheck.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ msg: "Email or Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        await client.query(
            'INSERT INTO users (id, username, email, password, created_at, first_name , last_name) VALUES ($1, $2, $3, $4, NOW(),$5 , $6)',
            [userId, username, email, hashedPassword, first_name, last_name]
        );

        const token = await generateEmailVerificationToken(userId, email)
        const verificationLink = `${process.env.BASE_URL}/verify?token=${token}`
        await client.query(
            'INSERT INTO verification (id, user_id) VALUES ($1, $2)',
            [token, userId]
        );

        await client.query('COMMIT');

        // 4. Send initial verification email
        const placeholders = {
            username: username,
            link: verificationLink,
            year: new Date().getFullYear(),
            token: token
        };
        await sendMailLogic(email, userId, placeholders);

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
            { userid: user.id, username: user.username, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "2d" }
        );


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
            const oneHour = 30 * 60 * 1000;

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
        domain: ".berrybox.cloud"
    });
    return res.status(200).json({ status: "Logged out" });
};

exports.profile = async (req, res) => {
    try {
        const { email, userid } = req.body;

        const query = `
            SELECT id, email, first_name, last_name 
            FROM users 
            WHERE email = $1 OR id = $2 
            LIMIT 1
        `;

        const data = await pool.query(query, [email || null, userid || null]);

        if (data.rows.length === 0) {
            return res.status(404).json({ status: "error", msg: "User not found" });
        }

        const profile = data.rows[0];

        return res.status(200).json({ status: "success", profile });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", msg: "Server error" });
    }
};

exports.changepassword = async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;
        const { token } = req.query

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(404).json({ status: "error", msg: "User not found" });
        }
        const query = `
            SELECT id, email, password 
            FROM users 
            WHERE email = $1 OR id = $2 
            LIMIT 1
        `;

        const data = await pool.query(query, [email || null, decoded.userid || null]);

        if (data.rows.length === 0) {
            return res.status(404).json({ status: "error", msg: "User not found" });
        }
        const user = data.rows[0];

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ status: "error", msg: "Current password mismatch" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updateQuery = `
            UPDATE users 
            SET password = $1 
            WHERE id = $2
        `;

        await pool.query(updateQuery, [hashedPassword, user.id]);

        return res.status(200).json({
            status: "success",
            msg: "Password updated successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", msg: "Server error" });
    }
};


/**
 * FORGOT PASSWORD - Generate Token & Send Email
 */
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ msg: "Email is required" });

        const result = await pool.query('SELECT id, username, email FROM users WHERE email = $1', [email.toLowerCase()]);
        const user = result.rows[0];

        // For security, don't confirm if a user exists or not
        if (!user) {
            return res.status(200).json({ status: "Success", msg: "If an account exists, a reset link has been sent." });
        }

        // Create a password reset token (Valid for 15 minutes)
        const resetToken = jwt.sign(
            { userId: user.id, type: 'password-reset' },
            process.env.JWT_EMAIL_SECRET, // Use your email secret
            { expiresIn: '15m' }
        );

        const resetLink = `https://berrybox.cloud/reset-password?token=${resetToken}`;

        const placeholders = {
            username: user.username,
            link: resetLink,
            year: new Date().getFullYear()
        };

        // Reuse your sendProEmail helper
        // Note: You should create a 'reset.html' template or reuse 'welcome.html' logic
        await sendProEmail(user.email, "Action Required: Reset Your Password", "reset.html", placeholders);

        return res.status(200).json({
            status: "Success",
            msg: "Reset link dispatched to your secure email."
        });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        return res.status(500).json({ error: "Could not process reset request" });
    }
};

/**
 * RESET PASSWORD - Verify Token & Update DB
 */
exports.resetPassword = async (req, res) => {
    const client = await pool.connect();
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ msg: "Token and new password are required" });
        }

        // 1. Verify Token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);
        } catch (err) {
            return res.status(401).json({ msg: "Reset link expired or invalid" });
        }

        if (decoded.type !== 'password-reset') {
            return res.status(401).json({ msg: "Invalid token type" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await client.query('BEGIN');

        // 2. Update user password
        const updateResult = await client.query(
            'UPDATE users SET password = $1 WHERE id = $2 RETURNING id',
            [hashedPassword, decoded.userId]
        );

        if (updateResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ msg: "User no longer exists" });
        }

        await client.query('COMMIT');

        return res.status(200).json({
            status: "Success",
            msg: "Protocol updated. You can now login with your new credentials."
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Reset Password Error:", error);
        return res.status(500).json({ error: "Server error during password reset" });
    } finally {
        client.release();
    }
};

exports.verifyEmail = async (req, res) => {
    const client = await pool.connect();
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ msg: "Verification token is missing" });
        }


        // 1. Verify the JWT Token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);
        } catch (err) {
            return res.status(401).json({
                msg: "Verification link is invalid or has expired. Please request a new one."
            });
        }

        // 2. Ensure it's the correct token type
        if (decoded.type !== 'email-verification') {
            return res.status(401).json({ msg: "Invalid token type" });
        }

        const userId = decoded.userId;

        await client.query('BEGIN');

        // 3. Check if user is already verified
        const userCheck = await client.query('SELECT is_verified FROM users WHERE id = $1', [userId]);

        if (userCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ msg: "User not found" });
        }

        if (userCheck.rows[0].is_verified) {
            await client.query('ROLLBACK');
            return res.status(200).json({ status: "Success", alreadyVerified: true, msg: "Email is already verified. You can log in." });
        }

        // 4. Update User Table
        await client.query(
            'UPDATE users SET is_verified = true WHERE id = $1',
            [userId]
        );

        // 5. Optional: Clear the token from the verification table so it can't be reused
        await client.query(
            'UPDATE verification SET verification_token = NULL WHERE user_id = $1',
            [userId]
        );

        await client.query('COMMIT');


        // Note: You can either return JSON or redirect the user to your login page
        return res.status(200).json({
            status: "Success",
            msg: "Email verified successfully! You may now log in."
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Verify Email Error:", error);
        return res.status(500).json({ error: "Server error during email verification" });
    } finally {
        client.release();
    }
};


exports.getMe = async (req, res) => {
    try {
        const token = req.query?.token

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        if (decoded) {
            const result = await pool.query(
                'SELECT id, username, role, is_suspended, is_verified , first_name , last_name, email FROM users WHERE id = $1',
                [decoded.userid]
            );
            if (result.rows.length === 0) return res.status(404).json({ msg: "User not found" });
            const user = result.rows[0];
            res.json(user);
        }
        else {
            throw new Error("User Auth not validated");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};
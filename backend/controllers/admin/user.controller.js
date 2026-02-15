const pool = require('../../config/db');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search || '';

        const query = `
            SELECT 
                u.id, 
                u.username, 
                u.email, 
                u.is_verified, 
                u.is_suspended, -- Added this to fetch the status
                u.created_at,
                COUNT(DISTINCT s.id) as total_services,
                COALESCE(SUM(i.price) FILTER (WHERE i.status = 'Paid'), 0) as total_spent
            FROM users u
            LEFT JOIN services s ON u.id = s.user_id
            LEFT JOIN invoices i ON u.id = i.user_id
            WHERE u.username ILIKE $1 OR u.email ILIKE $1
            GROUP BY u.id
            ORDER BY u.created_at DESC
            LIMIT $2 OFFSET $3
        `;

        const countQuery = `SELECT COUNT(*) FROM users WHERE username ILIKE $1 OR email ILIKE $1`;

        const [usersResult, totalResult] = await Promise.all([
            pool.query(query, [`%${search}%`, limit, offset]),
            pool.query(countQuery, [`%${search}%`])
        ]);

        res.json({
            users: usersResult.rows,
            total: parseInt(totalResult.rows[0].count),
            pages: Math.ceil(totalResult.rows[0].count / limit)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ... keep getUserDetails, suspendToggle, and resetPassword as they are

exports.getUserDetails = async (req, res) => {
    const { id } = req.params;
    try {
        // Get Services for this user
        const services = await pool.query(
            `SELECT s.*, p.plan_name, p.category 
             FROM services s 
             JOIN plans p ON s.plan_id = p.id 
             WHERE s.user_id = $1`, [id]
        );

        // Get Invoices for this user
        const invoices = await pool.query(
            `SELECT * FROM invoices WHERE user_id = $1 ORDER BY expiry_date DESC`, [id]
        );

        res.json({
            services: services.rows,
            invoices: invoices.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




exports.suspendToggle = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 
    try {
        await pool.query('UPDATE users SET is_suspended = $1 WHERE id = $2', [status, id]);
        res.json({ msg: `User ${status ? 'suspended' : 'activated'} successfully` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, id]);
        res.json({ msg: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const pool = require('../../config/db');

exports.getAllTransactions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search || '';

        const query = `
            SELECT 
                t.*, 
                u.username, 
                u.email,
                s.service_name
            FROM transactions t
            LEFT JOIN users u ON t.user_id = u.id
            LEFT JOIN services s ON t.service_id = s.id
            WHERE u.username ILIKE $1 OR t.order_id ILIKE $1 OR t.transaction_id ILIKE $1
            ORDER BY t.created_at DESC
            LIMIT $2 OFFSET $3
        `;

        const countQuery = `
            SELECT COUNT(*) FROM transactions t
            LEFT JOIN users u ON t.user_id = u.id
            WHERE u.username ILIKE $1 OR t.order_id ILIKE $1
        `;

        const [txResult, totalResult] = await Promise.all([
            pool.query(query, [`%${search}%`, limit, offset]),
            pool.query(countQuery, [`%${search}%`])
        ]);

        res.json({
            transactions: txResult.rows,
            total: parseInt(totalResult.rows[0].count),
            pages: Math.ceil(totalResult.rows[0].count / limit)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTransactionById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `SELECT t.*, u.username, s.service_name 
             FROM transactions t 
             JOIN users u ON t.user_id = u.id 
             LEFT JOIN services s ON t.service_id = s.id 
             WHERE t.transaction_id = $1`, [id]
        );
        if (result.rows.length === 0) return res.status(404).json({ msg: "Transaction not found" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
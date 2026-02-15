const pool = require('../../config/db');

// 1. Pending Orders (Invoices with status 'Unpaid')
exports.getPendingOrders = async (req, res) => {
    try {
        const query = `
            SELECT i.*, u.username, u.email, s.service_name, p.plan_name
            FROM invoices i
            JOIN users u ON i.user_id = u.id
            JOIN services s ON i.service_id = s.id
            JOIN plans p ON s.plan_id = p.id
            WHERE i.status = 'Unpaid'
            ORDER BY i.expiry_date ASC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 2. Next Renewals (Services expiring in the next 30 days)
exports.getUpcomingRenewals = async (req, res) => {
    try {
        const query = `
            SELECT s.id, s.service_name, s.renewal_date, u.username, p.plan_name, p.price, p.duration
            FROM services s
            JOIN users u ON s.user_id = u.id
            JOIN plans p ON s.plan_id = p.id
            WHERE s.renewal_date >= CURRENT_DATE 
            AND s.renewal_date <= CURRENT_DATE + INTERVAL '30 days'
            ORDER BY s.renewal_date ASC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 3. Global Invoices (All history with pagination)
exports.getGlobalInvoices = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const query = `
            SELECT i.*, u.username, s.service_name
            FROM invoices i
            JOIN users u ON i.user_id = u.id
            LEFT JOIN services s ON i.service_id = s.id
            ORDER BY i.expiry_date DESC
            LIMIT $1 OFFSET $2
        `;
        const countQuery = `SELECT COUNT(*) FROM invoices`;

        const [inv, count] = await Promise.all([
            pool.query(query, [limit, offset]),
            pool.query(countQuery)
        ]);

        res.json({
            invoices: inv.rows,
            total: parseInt(count.rows[0].count),
            pages: Math.ceil(count.rows[0].count / limit)
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
};


// 4. Instance Fleet (All Services with Filter)
exports.getAllServices = async (req, res) => {
    try {
        const { status, search } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        let queryParams = [];
        let whereClauses = [];

        // Dynamic Filtering
        if (status && status !== 'All') {
            queryParams.push(status);
            whereClauses.push(`s.status = $${queryParams.length}`);
        }

        if (search) {
            queryParams.push(`%${search}%`);
            whereClauses.push(`(s.service_name ILIKE $${queryParams.length} OR u.username ILIKE $${queryParams.length})`);
        }

        const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        const query = `
            SELECT s.*, u.username, u.email, p.plan_name, p.category
            FROM services s
            JOIN users u ON s.user_id = u.id
            JOIN plans p ON s.plan_id = p.id
            ${whereString}
            ORDER BY s.purchased_on DESC
            LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
        `;

        const countQuery = `
            SELECT COUNT(*) FROM services s
            JOIN users u ON s.user_id = u.id
            ${whereString}
        `;

        const [services, count] = await Promise.all([
            pool.query(query, [...queryParams, limit, offset]),
            pool.query(countQuery, queryParams)
        ]);

        res.json({
            services: services.rows,
            total: parseInt(count.rows[0].count),
            pages: Math.ceil(count.rows[0].count / limit)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
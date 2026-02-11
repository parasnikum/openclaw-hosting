const pool = require('../../config/db');
const { v4: uuidv4 } = require('uuid');

exports.createPlan = async (req, res) => {
    try {
        const { plan_name, config, duration, category, price, features } = req.body;

        if (!plan_name || !price) {
            return res.status(400).json({ msg: "Plan name and Price are required." });
        }

        const plan_id = uuidv4();

        const query = `
            INSERT INTO plans (id, plan_name, config, duration, category, price, features, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'Active')
            RETURNING *
        `;

        const values = [
            plan_id,
            plan_name,
            JSON.stringify(config || {}),
            duration,
            category,
            price,
            JSON.stringify(features || [])
        ];

        const result = await pool.query(query, values);
        return res.status(201).json({ status: "Success", plan: result.rows[0] });

    } catch (error) {
        console.error("Create Plan Error:", error);
        return res.status(500).json({ error: "Failed to create plan" });
    }
};

exports.updatePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { plan_name, config, duration, category, status, price, features } = req.body;

        // Verify plan exists
        const check = await pool.query('SELECT id FROM plans WHERE id = $1', [id]);
        if (check.rows.length === 0) return res.status(404).json({ msg: "Plan not found" });

        const query = `
            UPDATE plans 
            SET plan_name = COALESCE($1, plan_name),
                config = COALESCE($2, config),
                duration = COALESCE($3, duration),
                category = COALESCE($4, category),
                status = COALESCE($5, status),
                price = COALESCE($6, price),
                features = COALESCE($7, features)
            WHERE id = $8
            RETURNING *
        `;

        const values = [
            plan_name,
            config ? JSON.stringify(config) : null,
            duration,
            category,
            status,
            price,
            features ? JSON.stringify(features) : null,
            id
        ];

        const result = await pool.query(query, values);
        return res.status(200).json({ status: "Success", plan: result.rows[0] });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.deletePlan = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if plan is in use by any services
        const linkedCheck = await pool.query('SELECT id FROM services WHERE plan_id = $1 LIMIT 1', [id]);
        if (linkedCheck.rows.length > 0) {
            return res.status(400).json({
                msg: "Cannot delete plan. It is currently linked to active services. Try setting status to 'Inactive' instead."
            });
        }

        await pool.query('DELETE FROM plans WHERE id = $1', [id]);
        return res.status(200).json({ status: "Success", msg: "Plan deleted successfully." });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.getAllPlansAdmin = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM plans ORDER BY price ASC');
        return res.status(200).json(result.rows);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
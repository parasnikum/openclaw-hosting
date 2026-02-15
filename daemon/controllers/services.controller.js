import { commandQueue } from "../queue/commands.queue.js";
import pool from "../config/db.js"
import { deploy, redeploy } from "../docker/deploy.js";


export async function buildService(req, res) {
  const { serviceID } = req.params;
  const { category } = req.body;
  console.log(category);

  const result = await pool.query(
    ` SELECT  s.*,
    p.config,
    p.category,
    p.duration,
    p.plan_name
  FROM services s
  JOIN plans p ON s.plan_id = p.id 
  WHERE s.id = $1
  `,
    [serviceID]
  );


  await deploy(serviceID, category);
  res.json({ result: result.rows });
  // res.json({"serviceID":serviceID})
}

export async function rebuildService(req, res) {
  const { serviceID } = req.params;
  const { category } = req.body;
  const result = await pool.query(
    ` SELECT  s.*,
    p.config,
    p.category,
    p.duration,
    p.plan_name
  FROM services s
  JOIN plans p ON s.plan_id = p.id 
  WHERE s.id = $1
  `,
    [serviceID]
  );

  await redeploy(serviceID, category);
  res.json({ result: result.rows });
  // res.json({"serviceID":serviceID})
}



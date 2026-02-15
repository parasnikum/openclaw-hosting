const express = require("express");
const cors = require("cors"); // 1. Import CORS
const app = express();
const { connect } = require("./config/db");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { startServiceProvisioningCron } = require("./cron/autoDeploy");
dotenv.config()

const PORT = process.env.PORT || 3001;
connect();

app.use(cookieParser());
app.use(cors({
  origin: [process.env.BASE_URL,"http://localhost:8080" , "http://127.0.0.1:8080"], 
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.get("/api/v1/health", (req, res) => {
    res.json({ msg: "Backend is alive" });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const API = "/api/v1";

// Routes
app.use(`${API}/plans`, require("./routes/admin/plans.routes"));
app.use(`${API}/auth`, require("./routes/auth.routes"));
app.use(`${API}/nodes`, require("./routes/nodes.routes"));
app.use(`${API}/services`, require("./routes/services.routes"));
app.use(`${API}/servers`, require("./routes/servers.routes"));
app.use(`${API}/billing`, require("./routes/billing.routes"));
app.use(`${API}/checkout`, require("./routes/checkout.routes"));
app.use(`${API}/admin`, require("./routes/admin/user.routes"));
app.use(`${API}/admin/billing`, require("./routes/admin/billing.routes"));
app.listen(PORT, () => {
    console.log(`🚀 Server running on PORT ${PORT}`);
});

startServiceProvisioningCron();

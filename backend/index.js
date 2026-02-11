const express = require("express");
const cors = require("cors"); // 1. Import CORS
const app = express();
const { connect } = require("./config/db");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv")
dotenv.config()

// Connect to DB
connect();
// 2. Configure CORS (Must be before routes)
app.use(cors({
  origin: "http://localhost:8080", 
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(cookieParser());

// Test route - no DB, no controller
app.get("/api/v1/test", (req, res) => {
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

app.listen(3001, () => {
    console.log("🚀 Server running on http://localhost:3001");
});





// app.use(`${API}/dashboard`, require("./routes/dashboard.routes"));
// app.use(`${API}/nodes`, require("./routes/node.routes"));
// app.use(`${API}/instances`, require("./routes/instance.routes"));
// app.use(`${API}/services`, require("./routes/service.routes"));
// app.use(`${API}/billing`, require("./routes/billing.routes"));
// app.use(`${API}/system`, require("./routes/system.routes"));

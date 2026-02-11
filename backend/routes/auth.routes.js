const router = require("express").Router();
const AuthController = require("../controllers/auth.controller");

// router.post("/login", AuthController.login);
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/logout", AuthController.logout);
// router.get("/profile", AuthController.profile);
// router.post("/verify-email", AuthController.verifyEmail);

module.exports = router;

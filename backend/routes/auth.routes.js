const router = require("express").Router();
const AuthController = require("../controllers/auth.controller");
const {isAdmin , verifyAuth} = require("../middlewares/auth.middleware")
// router.post("/login", AuthController.login);
router.get("/me", AuthController.getMe);
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/logout", AuthController.logout);
router.get("/profile", AuthController.profile);
router.post("/change-password", AuthController.changepassword);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
router.get("/verify", AuthController.verifyEmail);

module.exports = router;

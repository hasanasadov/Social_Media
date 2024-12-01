const { Router } = require("express");
const { authController } = require("../controller/auth");
const { authorize, authenticate } = require("../middleware/auth");

const router = Router();

router.post("/login", authenticate, authController.login);
router.post("/register", authController.register);
router.post("/logout", authController.logout);
router.get("/current-user", authController.currentUser);
router.post("/forgot-password", authController.forgotPassword)
router.post("/reset-password", authController.resetPassword);


module.exports = router;

const { Router } = require("express");
const { authorize } = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const { validateSchema } = require("../middleware/validate");
const { updateUserSchema } = require("../validation/user");
const { userController } = require("../controller/user");

const router = Router();

router.patch(
  "/",
  authorize(),
  upload.single("image"),
  validateSchema(updateUserSchema),
  userController.update
);

module.exports = router;

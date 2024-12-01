const { Router } = require("express");
const { postController } = require("../controller/post");
const { authorize } = require("../middleware/auth");
const { validateSchema } = require("../middleware/validate");
const { postCreateSchema } = require("../validation/post");
const { postEditSchema } = require("../validation/post");
const { upload } = require("../middleware/upload");

const router = Router();

router.get("/", authorize(), postController.getAll);
router.post(
  "/",
  upload.single("image"),
  validateSchema(postCreateSchema),
  postController.create
);
router.put(
  "/:id",
  authorize(),
  upload.single("image"),
  validateSchema(postEditSchema),
  postController.update
);
router.delete("/:id", authorize(), postController.remove);
router.put("/:id/like", authorize(), postController.like);

module.exports = router;

const { Router } = require("express");
const { authorize } = require("../middleware/auth");
const { commentController } = require("../controller/comment");
const { validateSchema } = require("../middleware/validate");
const { commentSchema } = require("../validation/comment");

const router = Router();

router.get("/:postId", commentController.getAll);
router.post(
  "/:postId",
  authorize(),
  validateSchema(commentSchema),
  commentController.create
);
router.put(
  "/:id",
  authorize(),
  validateSchema(commentSchema),
  commentController.update
);
router.delete("/:id", authorize(), commentController.remove);

module.exports = router;

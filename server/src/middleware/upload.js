const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/post");
  },
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split(".").pop();
    const uniqueSuffix = uuidv4() + "." + fileExtension;
    const fileName = "post-" + uniqueSuffix;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });
module.exports = { upload };

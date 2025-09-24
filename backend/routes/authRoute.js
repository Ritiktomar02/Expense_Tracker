const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware.js");
const upload = require("../middleware/uploadMiddleware.js");

const {
  registerUser,
  loginUser,
  getInfoUser,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getInfoUser);

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded",
    });
  }

  const imageurl = `https://expense-tracker-backend-ml9d.onrender.com/uploads/${req.file.filename}`;
  console.log("Returning imageurl:", imageurl);
  res.status(200).json({ imageurl });

});
module.exports = router;

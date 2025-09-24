const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    let ext = "";
    if (file.mimetype === "image/jpeg") ext = "jpg";
    else if (file.mimetype === "image/png") ext = "png";
    else if (file.mimetype === "image/jpg") ext = "jpg";
    
    const name = file.originalname.split(".")[0].replace(/\s+/g, "-");
    
    cb(null, `${Date.now()}-${name}.${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .png and .jpg formats are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

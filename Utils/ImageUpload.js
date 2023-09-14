//import mutler for handling file upload
const multer = require("multer");

//import uuid for generating unique key
const { v4: uuidv4 } = require("uuid");

//mutler configure
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    const uniqueFilename = uuidv4() + "-" + file.originalname;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage }).single("image");

function ImageUpload(req, res, next) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      //error handling
      console.log(err.message);
      return res.status(500).json({ message: "error uploading photo" });
    } else if (err) {
      //error handling
      console.log(er);
      return res.status(500).json({ message: "error uploading photo" });
    }
    next();
  });
}

module.exports = ImageUpload;


var multer = require('multer');
var path = require('path');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads');
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + '-' + Date.now() + path.extname(file.originalname) 
      );
    },
  });
  
let upload = multer({ storage: storage });
module.exports = upload;

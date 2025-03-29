const multer = require('multer');
const path = require('path');

const createStorage = (folder) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, `../uploads/${folder}/`))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, `${folder}-${uniqueSuffix}${path.extname(file.originalname)}`)
    }
  });
};

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const categoryUpload = multer({
  storage: createStorage('categories'),
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const productUpload = multer({
  storage: createStorage('products'),
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = {
  categoryUpload,
  productUpload
};
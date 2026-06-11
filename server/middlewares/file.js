const multer = require("multer");
const sharp = require("sharp");
const { uploadToCloudinary } = require("../config/firebase");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

const multerFilter2 = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Not a file! Please upload only PDFs."), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const upload2 = multer({
  storage: multerStorage,
  fileFilter: multerFilter2,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Chat attachments: allow images, PDFs and common document/text types.
const allowedChatMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
];

const multerFilter3 = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image") ||
    allowedChatMimeTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type for chat upload."), false);
  }
};

const upload3 = multer({
  storage: multerStorage,
  fileFilter: multerFilter3,
  limits: { fileSize: 15 * 1024 * 1024 },
});

const uploadUserPhoto = upload.single("image");
const uploadDoctorPdf = upload2.single("degree");
const uploadChatFile = upload3.single("file");

const resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();

  req.file.buffer = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toBuffer();

  req.file.mimetype = "image/jpeg";
  next();
};

const uploadPhotoToCloudinary = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const uploadResult = await uploadToCloudinary({
      buffer: req.file.buffer,
      mimetype: req.file.mimetype,
      folder: "healthtalk/users",
      resourceType: "image",
    });

    req.file.fileName = uploadResult.secure_url;
    req.file.cloudinaryId = uploadResult.public_id;
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const uploadPdfToCloudinary = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const uploadResult = await uploadToCloudinary({
      buffer: req.file.buffer,
      mimetype: req.file.mimetype || "application/pdf",
      folder: "healthtalk/doctors/degrees",
      resourceType: "auto",
    });

    req.file.fileName = uploadResult.secure_url;
    req.file.cloudinaryId = uploadResult.public_id;
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = {
  uploadUserPhoto,
  uploadDoctorPdf,
  uploadChatFile,
  resizeUserPhoto,
  uploadPhotoToCloudinary,
  uploadPdfToCloudinary,
  // Backward-compatible aliases for any remaining imports.
  uploadPhotoToFirebase: uploadPhotoToCloudinary,
  uploadPdfToFirebase: uploadPdfToCloudinary,
};

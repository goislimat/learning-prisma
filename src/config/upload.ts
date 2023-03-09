import multer from "multer";
import path from "path";

export const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");
export const UPLOADS_FOLDER = path.resolve(__dirname, "..", "..", "uploads");

const storage = multer.diskStorage({
  destination: TMP_FOLDER,
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniquePrefix}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

export default upload;

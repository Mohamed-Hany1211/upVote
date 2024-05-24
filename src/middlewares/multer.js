// modules imports
import multer from "multer";
// files imports
import { allowedExtensions } from "../utils/allowedExtensions.js";

// multer middleware to upload the media on host 
export const multerMiddleWareHost = ({
    extinsions = allowedExtensions.image,
}) => {


    const storage = multer.diskStorage({});

    const fileFilter = (req, file, cb) => {
        if (extinsions.includes(file.mimetype.split('/')[1])) {
            return cb(null, true);
        }
        cb(new Error('Invalid extinsion'), false);
    }


    const file = multer({ fileFilter, storage });
    return file;
}
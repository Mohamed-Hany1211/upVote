// modules imports
import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
// files imports
import * as uc from './user.controller.js';
import { multerMiddleWareHost } from "../../middlewares/multer.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";

const router = new Router();


router.post('/signUp',multerMiddleWareHost({extinsions:allowedExtensions.image}).single('img'),expressAsyncHandler(uc.signUp));
router.post('/signIn',expressAsyncHandler(uc.signIn));


export default router;
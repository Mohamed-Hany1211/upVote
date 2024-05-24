// modules imports
import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
// files imports
import * as pc from './product.controller.js';
import { multerMiddleWareHost } from "../../middlewares/multer.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { endPointsRoles } from "./product.endPoints.roles.js";
import { validationMiddleware } from "../../middlewares/validation.midlleware.js";
import { likeProductSchema } from "./productValidayionSchemas.js";
const router = new Router();

router.post('/addProduct', auth(endPointsRoles.ADD_PRODUCTS), multerMiddleWareHost({
    extinsions: allowedExtensions.image
}).array('img', 2), expressAsyncHandler(pc.addProduct));

router.post('/like/:productId', auth(endPointsRoles.GET_ALL_PRODUCTS), validationMiddleware(likeProductSchema), expressAsyncHandler(pc.likeOrUnlikeProduct));
router.get('/getAllLikesForProduct/:productId', expressAsyncHandler(pc.getAllLikesForProduct));
router.put('/updateProduct/:productId', auth(endPointsRoles.ADD_PRODUCTS), multerMiddleWareHost({
    extinsions: allowedExtensions.image
}).single('img'), expressAsyncHandler(pc.updateProduct));

router.delete('/deleteProduct/:productId', auth(endPointsRoles.Delete_PRODUCTS), expressAsyncHandler(pc.deleteProduct));
router.get('/getAllProducts', auth(endPointsRoles.GET_ALL_PRODUCTS), expressAsyncHandler(pc.getAllProducts));


export default router;
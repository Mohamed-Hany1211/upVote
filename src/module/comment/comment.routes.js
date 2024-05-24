// modules imports
import { Router } from "express";
import asyncHandler from 'express-async-handler';
// files imports
import * as cc from './comment.controller.js';
import {auth} from '../../middlewares/auth.middleware.js';
import { endPointsRoles } from "../likes/likes.endPoints.roles.js";

const router = new Router();

router.post('/addComment/:productId',auth(endPointsRoles.LIKE), asyncHandler(cc.addComment));
router.post('/likeOrUnlikeComment/:commentId',auth(endPointsRoles.LIKE), asyncHandler(cc.likeOrUnlikeComment));



export default router;
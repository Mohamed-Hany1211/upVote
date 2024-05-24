// modules imports
import { Router } from "express";
import asyncHandler from 'express-async-handler';
// files imports
import * as lc from './likes.controller.js';
import {auth} from '../../middlewares/auth.middleware.js';
import { endPointsRoles } from "./likes.endPoints.roles.js";

const router = new Router();


router.get('/getUserLikes',auth(endPointsRoles.LIKE),asyncHandler(lc.getUserLikes));
router.post('/likeOrUnlike/:likeDoneOnId',auth(endPointsRoles.LIKE),asyncHandler(lc.likeOrUnlike))


export default router;
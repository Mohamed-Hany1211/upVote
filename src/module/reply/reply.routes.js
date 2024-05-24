// modules imports
import { Router } from "express";
import asyncHandler from 'express-async-handler';
// files imports
import { auth } from "../../middlewares/auth.middleware.js";
import * as rc from "./reply.controller.js";
import { endPointsRoles } from "./reply.endPoints.roles.js";


const router = new Router();

router.post('/addReply/:replyOnId', auth(endPointsRoles.reply), asyncHandler(rc.addReply));


export default router;
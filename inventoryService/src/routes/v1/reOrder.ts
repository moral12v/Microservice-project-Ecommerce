import express from 'express';
import { reOrderController } from '../../controllers/ReorderService';
import { customerAuthentication } from "../../middlewares/validateUser";

export const reOrderRoute = express.Router();


reOrderRoute.post("/",customerAuthentication,reOrderController.reorderItems )
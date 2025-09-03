import express from 'express';
import * as combinationdetailsController from "../../controllers/combinationdetailsController"
import { validateRequest } from '../../middlewares/validateRequest';
export const combinationdetailsRoute = express.Router();



combinationdetailsRoute.post('/register', validateRequest, combinationdetailsController.createCombinationDetailsHandler);
combinationdetailsRoute.get('/', combinationdetailsController.getAllCombinationDetailsHandler);
combinationdetailsRoute.get('/:id', combinationdetailsController.getCombinationDetailsByIdHandler);
combinationdetailsRoute.patch('/:id', combinationdetailsController.updateCombinationDetailsHandler);
combinationdetailsRoute.delete('/:id', combinationdetailsController.deleteCombinationDetailsHandler);



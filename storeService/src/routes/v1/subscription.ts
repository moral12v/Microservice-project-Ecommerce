import express from 'express';
import * as mallController from "../../controllers/mallController";
import  {subscriptionController} from "../../controllers/subscriptionController"
import { validateRequest } from '../../middlewares/validateRequest';
import { planController } from '../../controllers/planController';
export const subscriptionRoute = express.Router();
export const planRoute = express.Router();

subscriptionRoute.post('/create', validateRequest, subscriptionController.createSubscription);
subscriptionRoute.get('/', subscriptionController.getAllSubscriptions);
subscriptionRoute.get('/:id', subscriptionController.getSubscriptionById);
subscriptionRoute.patch('/:id', subscriptionController.updateSubscription);
subscriptionRoute.delete('/:id', subscriptionController.deleteSubscription);



////// PLAN ROUTE //////////

planRoute.post('/plan', validateRequest, planController.createPlan);
planRoute.get('/plan', planController.getAllPlans);
planRoute.get('/plan/:id', planController.getPlanById);
planRoute.patch('/plan/:id', planController.updatePlan);
planRoute.delete('/plan/:id', planController.deletePlan);
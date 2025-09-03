import express from 'express';
import { configController } from "../../controllers/configController";
import { validateRequest } from '../../middlewares/validateRequest';

export const configRoute = express.Router();

configRoute.post('/create', validateRequest, configController.createConfig);
configRoute.get('/', configController.getAllConfigs);
configRoute.get('/:id', configController.getConfigById);
configRoute.patch('/:id', configController.updateConfig);
configRoute.delete('/:id', configController.deleteConfig);
configRoute.get('/model/:modelKey', configController.getConfigByModelKey);

export default configRoute;

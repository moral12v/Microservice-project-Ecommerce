import express from 'express';
import AddonMetaDataController from '../../controllers/addonMetaDataController';

export const addonMetaRoute = express.Router();

addonMetaRoute.post('/', AddonMetaDataController.createAddonMetaData);
addonMetaRoute.get('/:id', AddonMetaDataController.getAddonMetaDataById);
addonMetaRoute.get('/', AddonMetaDataController.getAllAddonMetaData);
addonMetaRoute.patch('/:id', AddonMetaDataController.updateAddonMetaData);
addonMetaRoute.delete('/:id', AddonMetaDataController.deleteAddonMetaData);

export default addonMetaRoute;

import express from 'express';
import AddonController from '../../controllers/addonController';
import ProductAddonController from '../../controllers/productAddonController';

export const AddonRoute = express.Router();


AddonRoute.post("/addon", AddonController.createAddon)
AddonRoute.get("/addon", AddonController.getAllAddons)
AddonRoute.get("/addon/:id", AddonController.getAddonById)
AddonRoute.patch("/addon/:id", AddonController.updateAddon)
AddonRoute.delete("/addon/:id", AddonController.deleteAddon)




//////////PRODUCT------ADDON

AddonRoute.post("/productaddon", ProductAddonController.createProductAddon)
AddonRoute.get("/productaddon", ProductAddonController.getAllProductAddons)
AddonRoute.get("/productaddon/:id", ProductAddonController.getProductAddonById)
AddonRoute.patch("/productaddon/:id", ProductAddonController.updateProductAddon)
AddonRoute.delete("/productaddon/:id", ProductAddonController.deleteProductAddon)
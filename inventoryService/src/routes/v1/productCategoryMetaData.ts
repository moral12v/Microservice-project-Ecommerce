import express from 'express';
import ProductCategoryMetaDataController from '../../controllers/productCategoryMetaDataController';
import { merchantAuthentication } from '../../middlewares/validateMerchant';

export const productCategoryRoute = express.Router();

productCategoryRoute.post('/', ProductCategoryMetaDataController.createProductCategoryMetaData);
// productCategoryRoute.get('/:id', ProductCategoryMetaDataController.getProductCategoryMetaDataById);
productCategoryRoute.patch('/:id', ProductCategoryMetaDataController.updateProductCategoryMetaData);
productCategoryRoute.delete('/:id', ProductCategoryMetaDataController.deleteProductCategoryMetaData);





productCategoryRoute.post('/merchant',merchantAuthentication, ProductCategoryMetaDataController.createProductCategoryMetaDataForMerchant);
productCategoryRoute.get('/merchant',merchantAuthentication, ProductCategoryMetaDataController.productCategoryMetaDataGetByMerchant);
import express from 'express';
import * as subcategoryController from "../../controllers/subcategoryController"
import * as categoryController from "../../controllers/categoryController"
import * as serviceController from "../../controllers/servicesController"
import * as productvarientController from "../../controllers/productvarientController"
import * as categoryAttributeController from "../../controllers/categoryattribureController"
import * as productController from "../../controllers/productController"
import { validateRequest } from '../../middlewares/validateRequest';
export const productRoute = express.Router();
export const router = express.Router();
export const AdminRoute = express.Router();


/// ADNMIN ---- SERVICE

AdminRoute.post('/service/', validateRequest, serviceController.createServiceHandler);
AdminRoute.get('/service/', serviceController.getAllServicesHandler);
AdminRoute.get('/service/:id', serviceController.getServiceByIdHandler);
AdminRoute.patch('/service/:id', serviceController.updateServiceHandler);
AdminRoute.delete('/service/:id', serviceController.deleteServiceHandler);

//ADMIN ----- CATEGORY
AdminRoute.post('/categoryAttribute/', validateRequest, categoryAttributeController.createCategoryAttributeHandler);
AdminRoute.get('/categoryAttribute/', categoryAttributeController.getAllCategoriesAttributeHandler);
AdminRoute.get('/categoryAttribute/:id', categoryAttributeController.getCategoryAttributeByIdHandler);
AdminRoute.patch('/categoryAttribute/:id', categoryAttributeController.updateCategoryAttributeHandler);
AdminRoute.delete('/categoryAttribute/:id', categoryAttributeController.deleteCategoryAttributeHandler);


///ADMIN -------- PRODUCTS

AdminRoute.post('/product/', validateRequest, productController.createProductHandler);
AdminRoute.get('/product/', productController.getAllProductsHandler);
AdminRoute.get('/product/:id', productController.getProductByIdHandler);
AdminRoute.patch('/product/:id', productController.updateProductHandler);
AdminRoute.delete('/product/:id', productController.deleteProductHandler);
AdminRoute.get('/products/category/:categoryId', productController.getProductsByCategoryHandler)
AdminRoute.get('/products/active', productController.getActiveProductsHandler)
// AdminRoute.patch('/products/:id/status', productController.toggleProductStatusHandler)
AdminRoute.patch('/products/:id/approve', productController.approveProductByAdminHandler)

/////ADMIN ------------- PRODUCTVARIENT

AdminRoute.post('/variant', validateRequest, productvarientController.createproductvarientHandler);
AdminRoute.get('/variant', productvarientController.getAllProductvarientHandler);
AdminRoute.get('/variant/:id', productvarientController.getproductvarientByIdHandler);
AdminRoute.patch('/variant/:id', productvarientController.updateProductvarientHandler);
AdminRoute.delete('/variant/:id', productvarientController.deleteProductvarientHandler);



///////ADMIN--------CATEGORY

AdminRoute.post('/category', validateRequest, categoryController.createCategoryHandler);
AdminRoute.get('/category/', categoryController.getAllCategoriesHandler);
AdminRoute.get('/category/:id', categoryController.getCategoryByIdHandler);
AdminRoute.patch('/category/:id', categoryController.updateCategoryHandler);
AdminRoute.delete('/category/:id', categoryController.deleteCategoryHandler);

// ADMIN-----------SUBCATEGOTY

AdminRoute.post('/sub-category', validateRequest, subcategoryController.createSubcategoryHandler);
AdminRoute.get('/sub-category', subcategoryController.getAllSubcategoriesHandler);
AdminRoute.get('/sub-category/:id', subcategoryController.getAllSubcategoriesHandler);
// AdminRoute.get('/sub-category/:id', subcategoryController.getSubcategoriesByCategoryIdHandler);
AdminRoute.patch('/sub-category/:id', subcategoryController.updateSubcategoryHandler);
AdminRoute.delete('/sub-category/:id', subcategoryController.deleteSubcategoryHandler);


////////////ADDON/////////////



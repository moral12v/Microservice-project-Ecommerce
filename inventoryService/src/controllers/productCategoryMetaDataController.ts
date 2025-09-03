import { Request, Response } from "express";
import ProductCategoryMetaDataService from "../services/productCategoryMetaData";
import {
  CreateProductCategoryMetaDataDTO,
  UpdateProductCategoryMetaDataDTOO,
} from "../dtos/productCategoryMetaDataDTO";

class ProductCategoryMetaDataController {
  static async createProductCategoryMetaData(
    req: Request, 
    res: Response
  ): Promise<void> {
    try {
      const dto: CreateProductCategoryMetaDataDTO = req.body;
      const newProductCategoryMetaData =
        await ProductCategoryMetaDataService.createProductCategoryMetaData(dto);
      res.status(201).json({
        success: true,
        message: "ProductCategoryMetaData created successfully",
        data: newProductCategoryMetaData,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getProductCategoryMetaDataById(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const id = req.params.id;
      const productCategoryMetaData =
        await ProductCategoryMetaDataService.getProductCategoryMetaDataById(id);
      if (productCategoryMetaData) {
        res.status(200).json({ success: true, data: productCategoryMetaData });
      } else {
        res.status(404).json({
          success: false,
          message: "ProductCategoryMetaData not found",
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to get ProductCategoryMetaData",
      });
    }
  }

  static async getAllProductCategoryMetaData(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const active =
        req.query.active === "true"
          ? true
          : req.query.active === "false"
          ? false
          : undefined;
      const productCategoryMetaData =
        await ProductCategoryMetaDataService.getAllProductCategoryMetaData(); // Adjust if filtering by `active`
      res.status(200).json({ success: true, data: productCategoryMetaData });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateProductCategoryMetaData(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const id = req.params.id;
      const dto: UpdateProductCategoryMetaDataDTOO = req.body;
      const updatedProductCategoryMetaData =
        await ProductCategoryMetaDataService.updateProductCategoryMetaData(
          id,
          dto
        );
      if (updatedProductCategoryMetaData) {
        res.status(200).json({
          success: true,
          message: "ProductCategoryMetaData updated successfully",
          data: updatedProductCategoryMetaData,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "ProductCategoryMetaData not found",
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to update ProductCategoryMetaData",
      });
    }
  }

  static async deleteProductCategoryMetaData(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const id = req.params.id;
      await ProductCategoryMetaDataService.deleteProductCategoryMetaData(id);
      res.status(200).json({
        success: true,
        message: "ProductCategoryMetaData deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to delete ProductCategoryMetaData",
      });
    }
  }

 
  static async productCategoryMetaDataGetByMerchant(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const merchantIdString = req?.merchant?._id; 
  
      if (!merchantIdString) {
        res.status(400).json({ success: false, message: "Merchant ID is missing." });
        return;
      }
  
      const productCategoryMetaData = await ProductCategoryMetaDataService.getByMerchant(merchantIdString);
  
      if (productCategoryMetaData && productCategoryMetaData.length > 0) {
        res.status(200).json({ success: true, data: productCategoryMetaData });
      } else {
        res.status(404).json({
          success: false,
          message: "Product Category MetaData not found",
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to get ProductCategoryMetaData",
        error: error.message,
      });
    }
  }

  static async createProductCategoryMetaDataForMerchant(
    req: Request, 
    res: Response
  ): Promise<void> {
    try {
      const merchantIdString = req?.merchant?._id;
      console.log('Merchant ID:', merchantIdString);
      const dto: CreateProductCategoryMetaDataDTO = {
        ...req?.body,
        merchantId: merchantIdString
      
      };
      const newProductCategoryMetaData =
        await ProductCategoryMetaDataService.createProductCategoryMetaData(dto);
      res.status(201).json({
        success: true,
        message: "ProductCategoryMetaData created successfully",
        data: newProductCategoryMetaData,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
export default ProductCategoryMetaDataController;


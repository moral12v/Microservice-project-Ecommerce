import { Request, Response } from 'express';
import ProductAddonService from '../services/productAddonService';
import { CreateProductAddonDTO, UpdateProductAddonDTO } from "../dtos/productAddon"

class ProductAddonController {
  static async createProductAddon(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateProductAddonDTO = req.body;
      const newProductAddon = await ProductAddonService.createProductAddon(dto);
      res.status(201).json({ success: true, data: newProductAddon });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getProductAddonById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const productAddon = await ProductAddonService.getProductAddonById(id);
      if (productAddon) {
        res.status(200).json({ success: true, data: productAddon });
      } else {
        res.status(404).json({ success: false, message: 'ProductAddon not found' });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAllProductAddons(req: Request, res: Response): Promise<void> {
    try {
      const productAddons = await ProductAddonService.getAllProductAddons();
      res.status(200).json({ success: true, data: productAddons });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateProductAddon(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const dto: UpdateProductAddonDTO = req.body;
      const updatedProductAddon = await ProductAddonService.updateProductAddon(id, dto);
      if (updatedProductAddon) {
        res.status(200).json({ success: true, data: updatedProductAddon });
      } else {
        res.status(404).json({ success: false, message: 'ProductAddon not found' });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteProductAddon(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      await ProductAddonService.deleteProductAddon(id);
      res.status(200).json({ success: true, message: 'ProductAddon deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default ProductAddonController;

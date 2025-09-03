import { Request, Response } from 'express';
import AddonService from '../services/addonService';
import { CreateAddonDTO, UpdateAddonDTO } from '../dtos/AddonDTO';

class AddonController {
  static async createAddon(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateAddonDTO = req.body;
      const newAddon = await AddonService.createAddon(dto);
      res.status(201).json({ success: true, message: 'Addon created successfully', data: newAddon });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAddonById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const addon = await AddonService.getAddonById(id);
      if (addon) {
        res.status(200).json({ success: true, data: addon });
      } else {
        res.status(404).json({ success: false, message:"Addon get successfully"  });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message:" Failed to get addon " });
    }
  }

  static async getAllAddons(req: Request, res: Response): Promise<void> {
    try {
      
      const available = req.query.available === 'true' ? true : req.query.available === 'false' ? false : undefined;
      const approve = req.query.approve === 'true' ? true : req.query.approve === 'false' ? false : undefined;
      
  
      const addons = await AddonService.getAllAddons( approve);
      
      res.status(200).json({ success: true, data: addons });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateAddon(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const dto: UpdateAddonDTO = req.body;
      const updatedAddon = await AddonService.updateAddon(id, dto);
      if (updatedAddon) {
        res.status(200).json({ success: true, message:" Addon  update successfully " });
      } else {
        res.status(404).json({ success: false, message: 'Addon not found' });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message:" Failed to update addon " });
    }
  }

  static async deleteAddon(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      await AddonService.deleteAddon(id);
      res.status(200).json({ success: true, message: 'Addon deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message:" Failed to get delete addon " });
    }
  }
}

export default AddonController;

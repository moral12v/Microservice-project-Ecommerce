import { Request, Response } from 'express';
import AddonMetaDataService from '../services/addonMetaDAtaService';
import { CreateAddonMetaDataDTO, UpdateAddonMetaDataDTO } from '../dtos/addonMetaDataDTO';

class AddonMetaDataController {
  static async createAddonMetaData(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateAddonMetaDataDTO = req.body;
      const newAddonMetaData = await AddonMetaDataService.createAddonMetaData(dto);
      res.status(201).json({ success: true, message: 'AddonMetaData created successfully', data: newAddonMetaData });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAddonMetaDataById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const addonMetaData = await AddonMetaDataService.getAddonMetaDataById(id);
      if (addonMetaData) {
        res.status(200).json({ success: true, data: addonMetaData });
      } else {
        res.status(404).json({ success: false, message: 'AddonMetaData not found' });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to get AddonMetaData' });
    }
  }

  static async getAllAddonMetaData(req: Request, res: Response): Promise<void> {
    try {
      const {    merchantId} = req?.query;
      const merchantIdString = merchantId as string
      const addonMetaData = await AddonMetaDataService.getAllAddonMetaData(merchantIdString); 
      res.status(200).json({ success: true, data: addonMetaData });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateAddonMetaData(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const dto: UpdateAddonMetaDataDTO = req.body;
      const updatedAddonMetaData = await AddonMetaDataService.updateAddonMetaData(id, dto);
      if (updatedAddonMetaData) {
        res.status(200).json({ success: true, message: 'AddonMetaData updated successfully', data: updatedAddonMetaData });
      } else {
        res.status(404).json({ success: false, message: 'AddonMetaData not found' });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to update AddonMetaData' });
    }
  }

  static async deleteAddonMetaData(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      await AddonMetaDataService.deleteAddonMetaData(id);
      res.status(200).json({ success: true, message: 'AddonMetaData deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Failed to delete AddonMetaData' });
    }
  }

}

export default AddonMetaDataController;

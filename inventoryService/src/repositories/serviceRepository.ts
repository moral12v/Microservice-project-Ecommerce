import Service, { ServiceDoc } from '../models/Service';

export class ServiceRepository {
  async createService(serviceData: Partial<ServiceDoc>): Promise<ServiceDoc> {
    const service = new Service(serviceData);
    return await service.save();
  }

  async getServiceById(serviceId: string): Promise<ServiceDoc | null> {
    return await Service.findById(serviceId).exec();
  }

  async updateService(serviceId: string, updateData: Partial<ServiceDoc>): Promise<ServiceDoc | null> {
    return await Service.findByIdAndUpdate(serviceId, updateData, { new: true }).exec();
  }

  async deleteService(serviceId: string): Promise<ServiceDoc | null> {
    return await Service.findByIdAndDelete(serviceId).exec();
  }

  async getAllServices(): Promise<ServiceDoc[]> {
    return await Service.find().exec();
  }

  async getServicesById(serviceId: string): Promise<ServiceDoc[]> {
    return await Service.find({ serviceId }).exec();
  }
}

export const serviceRepository = new ServiceRepository();

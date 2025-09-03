import { ServiceDoc } from '../models/Service';
import { serviceRepository } from '../repositories/serviceRepository';
import { CreateServiceDTO, UpdateServiceDTO } from '../dtos/serviceDTO';

export const createService = async (serviceDto: CreateServiceDTO): Promise<ServiceDoc> => {
  return await serviceRepository.createService(serviceDto);
};

export const getAllServices = async (): Promise<ServiceDoc[]> => {
  return await serviceRepository.getAllServices();
};

export const getServiceById = async (serviceId: string): Promise<ServiceDoc | null> => {
  return await serviceRepository.getServiceById(serviceId);
};

export const updateService = async (serviceId: string, updateDto: UpdateServiceDTO): Promise<ServiceDoc | null> => {
  return await serviceRepository.updateService(serviceId, updateDto);
};

export const deleteService = async (serviceId: string): Promise<ServiceDoc | null> => {
  return await serviceRepository.deleteService(serviceId);
};

export const getServicesByCategoryId = async (categoryId: string): Promise<ServiceDoc[]> => {
  return await serviceRepository.getServicesById(categoryId);
};

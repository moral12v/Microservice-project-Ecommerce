import { MallDoc } from "../models/Mall";
import { mallRepository } from "../repositories/mallRepository";
import { CreateMallDTO, UpdateMallDTO } from "../dtos/MallDto";

export const getAllMalls = async (): Promise<MallDoc[] | null> => {
  const data = await mallRepository.getAllMalls();
  return data ? data : [];
};

export const getMallById = async (mallId: string): Promise<MallDoc | null> => {
  return await mallRepository.getMallById(mallId);
};

export const createMall = async (data: CreateMallDTO): Promise<MallDoc> => {
  const location = {
    type: "Point",
    coordinates: [data.lng ? data.lng : 0, data.lat ? data.lat : 0] as [
      number,
      number
    ],
  };
  const newMallData: Partial<MallDoc> = {
    ...data,
    location,
  };
  return await mallRepository.createMall(newMallData);
};
export const updateMall = async (
  mallId: string,
  updateData: Partial<MallDoc>
): Promise<MallDoc | null> => {
  return await mallRepository.updateMall(mallId, updateData);
};

export const deleteMall = async (mallId: string): Promise<MallDoc | null> => {
  return await mallRepository.deleteMall(mallId);
};

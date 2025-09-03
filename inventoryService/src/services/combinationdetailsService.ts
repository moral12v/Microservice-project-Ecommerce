import { CombinationdetailsDoc } from "../models/Combinationdetails";
import { combinationdetailsRepository } from "../repositories/combinationdetailsRepository";
import { CreatecominationdetailsDTO, UpdatecombinationdetailsDTO } from "../dtos/combinationdeatilsDTO";


export const createCombinationDetails = async (detailsDto: CreatecominationdetailsDTO): Promise<CombinationdetailsDoc> => {
  return await combinationdetailsRepository.createCombinationdetails(detailsDto);
};

export const getAllCombinationDetails = async (): Promise<CombinationdetailsDoc[]> => {
  return await combinationdetailsRepository.getAllcombinationdetails();
};

export const getCombinationDetailsById = async (detailsId: string): Promise<CombinationdetailsDoc | null> => {
  return await combinationdetailsRepository.getcombinationdetailsById(detailsId);
};

export const updateCombinationDetails = async (detailsId: string, detailsDto: UpdatecombinationdetailsDTO): Promise<CombinationdetailsDoc| null> => {
  return await combinationdetailsRepository.updatecombinationdetails(detailsId, detailsDto);
};

export const deleteCombinationDetails = async (detailsId: string): Promise<void> => {
  await combinationdetailsRepository.deletecombinationdetails(detailsId);
};

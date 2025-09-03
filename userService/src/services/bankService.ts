import { CreateBankDTO } from 'src/dtos/VendorDTO';
import { VendorDoc } from '../models/Vendor';
import { bankRepository } from '../repositories/bankRepository';


export const createBank = async (bankDto: CreateBankDTO): Promise<VendorDoc> => {
  return await bankRepository.createBank(bankDto);
};

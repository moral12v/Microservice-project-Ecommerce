import StoreDeliveryType from "src/models/StoreDeliveryType";
import StoreBranch, {StoreBranchDoc} from "../models/StoreBranch";

export class StoreBranchRepository {
  async createStoreBranch(storeBranchData: Partial<StoreBranchDoc>): Promise<StoreBranchDoc> {
      
    const storeBranch = new StoreBranch(storeBranchData);
      return await storeBranch.save();
    }  
  }
  export const storeBranchRepository = new StoreBranchRepository();

  
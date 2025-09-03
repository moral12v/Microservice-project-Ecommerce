import Combinationdetails,{CombinationdetailsDoc} from "../models/Combinationdetails";

export class CombinationdetailsRepository {
  async createCombinationdetails(detailsData: Partial<CombinationdetailsDoc>): Promise<CombinationdetailsDoc> {
    const combinationdetails = new Combinationdetails(detailsData);
    return await combinationdetails.save();
  }
  
  async getcombinationdetailsById(detailsId: string): Promise<CombinationdetailsDoc | null> {
    return await Combinationdetails.findById(detailsId).exec();
  }

  async updatecombinationdetails(detailsId: string, updateData: Partial<CombinationdetailsDoc>): Promise<CombinationdetailsDoc | null> {
    return await Combinationdetails.findByIdAndUpdate(detailsId, updateData, { new: true }).exec();
  }

  async deletecombinationdetails(detailsId: string): Promise<CombinationdetailsDoc | null> {
    return await Combinationdetails.findByIdAndDelete(detailsId).exec();
  }

  async getAllcombinationdetails(): Promise<CombinationdetailsDoc[]> {
    return await Combinationdetails.find().exec();
  }
}

export const combinationdetailsRepository = new CombinationdetailsRepository();


  


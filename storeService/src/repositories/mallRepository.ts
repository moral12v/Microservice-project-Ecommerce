import { StoreDoc } from "../models/Store";
import Mall, { MallDoc } from "../models/Mall";
import mongoose from "mongoose";

export class MallRepository {
  async createMall(mallData: Partial<MallDoc>): Promise<MallDoc> {
    const mall = new Mall(mallData);
    return await mall.save();
  }

  async getAllMalls(): Promise<MallDoc[]> {
    return await Mall.find({}).exec();
  }

  async getMallById(mallId: string): Promise<MallDoc | null> {
    const malls = await Mall.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(mallId) },
      },
      {
        $addFields: { idAsString: { $toString: "$_id" } },
      },
      {
        $lookup: {
          from: 'stores',
          localField: 'idAsString',
          foreignField: 'mallId',
          as: 'stores',
        },
      },
      {
        $project: {
          _id: 0,
          mallDetails: {
            _id: "$_id",
            mallName: "$mallName",
            mallAddress: "$mallAddress",
            location: "$location",
            mallImageUrl: "$mallImageUrl",
            description: "$description",
            isActive: "$isActive",
          },
          stores: 1,
        },
      },
      {
        $unset: "idAsString", 
      },
    ]);
  
    return malls.length > 0 ? malls[0] : null;
  }
  
  
  async updateMall(
    mallId: string,
    updateData: Partial<MallDoc>
  ): Promise<MallDoc | null> {
    return await Mall.findByIdAndUpdate(mallId, updateData, {
      new: true,
    }).exec();
  }

  async deleteMall(mallId: string): Promise<MallDoc | null> {
    return await Mall.findByIdAndDelete(mallId).exec();
  }

  async nearbyMall(
    userCoordinates: [number, number]
  ): Promise<(MallDoc & { distance: number; stores: StoreDoc[] })[]> {
    return await Mall.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: userCoordinates,
          },
          distanceField: 'distance',
          spherical: true,
        },
      },
      {
        $addFields: {
          distance: { 
            $round: [{ $divide: ["$distance", 1000] }, 2] 
          }
        }
      },
      {
        $match: {
          distance: { $lt: 50 },
        },
      },
      {
        $addFields:{idAsString: { $toString: "$_id" }}
      },
      {
        $lookup: {
          from: 'stores',        
          localField: 'idAsString',       
          foreignField: 'mallId',  
          as: 'stores',             
        }
      },
      {
      $unset: "idAsString"
      }
    ]).exec();
  }
  
}

export const mallRepository = new MallRepository();

import { getCurrentTime, getDayOfWeek } from "../utils/dateTime";
import Store, { StoreDoc, StoreTimingSlot } from "../models/Store";
import mongoose from "mongoose";

export class StoreRepository {
  async createStore(StoreData: Partial<StoreDoc>): Promise<StoreDoc> {
    const store = new Store(StoreData);
    return await store.save();
  }

  async getStoreById(storeId: string): Promise<StoreDoc | null> {
    return await Store.findById(storeId).exec();
  }

  async updateStore(
    storeId: string,
    updateData: Partial<StoreDoc>
  ): Promise<StoreDoc | null> {
    return await Store.findByIdAndUpdate(storeId, updateData, {
      new: true,
    });
  }

  async getAllStore(
    page: number,
    limit: number,
    aggregatorId: string,
    isPagination: string,
    approved: string
  ): Promise<any> {
    const query: any = {};
    if (aggregatorId) {
      query.aggregatorId = aggregatorId;
    }
    if (approved) {
      query.approved = approved;
    }
    if (isPagination == "false") {
      const stores = await Store.find(query).exec();
      return { stores, total: stores.length };
    } else {
      const stores = await Store.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
      const total = await Store.countDocuments(query).exec();
      return { stores, total };
    }
  }

  async findByEmail(email: string): Promise<StoreDoc | null> {
    return await Store.findOne({ email }).exec();
  }

  async getStoreDetailsById(storeId: string): Promise<StoreDoc | null> {
    return await Store.findById(storeId);
  }

  async nearbyStores({
    userCoordinates,
    name = "",
    subCategory,
    category,
  }: {
    userCoordinates: [number, number];
    name?: string;
    subCategory: string;
    category: string;
  }): Promise<any[] | []> {
    const currentDay = getDayOfWeek();
    const currentTime = getCurrentTime();
    const distanceLimits = [10, 15, 20, 25, 50];

    let storeDetailsWithEstimatedTime: any[] = [];

    for (const maxDistance of distanceLimits) {
      console.log(`Searching within ${maxDistance} km...`);

      const nearbyStores = await Store.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: userCoordinates,
            },
            distanceField: "distance",
            maxDistance: maxDistance * 1000,
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
          $addFields: {
            openTimings: {
              $filter: {
                input: "$timings",
                as: "timing",
                cond: { $eq: ["$$timing.day", currentDay] },
              },
            },
            isOpen: {
              $anyElementTrue: {
                $map: {
                  input: "$timings",
                  as: "timing",
                  in: {
                    $anyElementTrue: {
                      $map: {
                        input: "$$timing.slots",
                        as: "slot",
                        in: {
                          $and: [
                            { $lte: ["$$slot.openingTime", currentTime] },
                            { $gte: ["$$slot.closingTime", currentTime] },
                            { $eq: ["$$slot.isOpen", true] },
                          ],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          $match: {
            distance: { $lt: maxDistance },
            approved: "approved",
            isActive: true,
            ...(name ? { name: { $regex: new RegExp(name, "i") } } : {}),
            ...(category ? { productType: category } : {}),
            ...(subCategory
              ? { "subCategory._id": new mongoose.Types.ObjectId(subCategory) || subCategory }
              : {}),
          },
        },
      ]).exec();

      console.log(
        `Found ${nearbyStores.length} stores within ${maxDistance} km.`
      );

      nearbyStores.forEach((storeDetail: any) => {
        const estimatedDeliveryTime = generateEstimatedTime(
          storeDetail.distance
        );
        storeDetailsWithEstimatedTime.push({
          ...storeDetail,
          estimatedDeliveryTime,
        });
      });

      if (nearbyStores.length > 0) {
        break;
      }
      
    }

    return storeDetailsWithEstimatedTime;
  }

  async nearbyStoresFilter({
    userCoordinates,
    name = "",
    subCategory,
    category,
  }: {
    userCoordinates: [number, number];
    name?: string;
    subCategory: string;
    category: string;
  }): Promise<any[] | []> {
    const currentDay = getDayOfWeek();
    const currentTime = getCurrentTime();
    const distanceLimits = [10, 15, 20, 25, 50];

    let storeDetailsWithEstimatedTime: any[] = [];

    for (const maxDistance of distanceLimits) {
      console.log(`Searching within ${maxDistance} km...`);

      const nearbyStores = await Store.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: userCoordinates,
            },
            distanceField: "distance",
            maxDistance: maxDistance * 1000,
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
          $addFields: {
            openTimings: {
              $filter: {
                input: "$timings",
                as: "timing",
                cond: { $eq: ["$$timing.day", currentDay] },
              },
            },
            isOpen: {
              $anyElementTrue: {
                $map: {
                  input: "$timings",
                  as: "timing",
                  in: {
                    $anyElementTrue: {
                      $map: {
                        input: "$$timing.slots",
                        as: "slot",
                        in: {
                          $and: [
                            { $lte: ["$$slot.openingTime", currentTime] },
                            { $gte: ["$$slot.closingTime", currentTime] },
                            { $eq: ["$$slot.isOpen", true] },
                          ],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          $match: {
            distance: { $lt: maxDistance },
            approved: "approved",
            isActive: true,
            ...(name ? { name: { $regex: new RegExp(name, "i") } } : {}),
            ...(category ? { productType: category } : {}),
            ...(subCategory
              ? { "subCategory._id": new mongoose.Types.ObjectId(subCategory) }
              : {}),
          },
        },
      ]).exec();

      console.log(
        `Found ${nearbyStores.length} stores within ${maxDistance} km.`
      );

      nearbyStores.forEach((storeDetail: any) => {
        const estimatedDeliveryTime = generateEstimatedTime(
          storeDetail.distance
        );
        storeDetailsWithEstimatedTime.push({
          ...storeDetail,
          estimatedDeliveryTime,
        });
      });

      if (nearbyStores.length > 0) {
        break;
      }
    }

    return storeDetailsWithEstimatedTime;
  }

  async nearbyStoresCategoryWise(
    userCoordinates: [number, number],
    categoryId: string
  ): Promise<
    (StoreDoc & {
      distance: number;
      isOpen: boolean;
      openTimings: StoreTimingSlot[];
    })[]
  > {
    const currentDay = getDayOfWeek();
    const currentTime = getCurrentTime();

    const distanceLimits = [10, 15, 20, 25, 50];
    let nearbyStores: (StoreDoc & {
      distance: number;
      isOpen: boolean;
      openTimings: StoreTimingSlot[];
    })[] = [];

    for (const maxDistance of distanceLimits) {
      console.log(`Searching within ${maxDistance} km...`);

      nearbyStores = await Store.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: userCoordinates,
            },
            distanceField: "distance",
            maxDistance: maxDistance * 1000,
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
          $addFields: {
            openTimings: {
              $filter: {
                input: "$timings",
                as: "timing",
                cond: { $eq: ["$$timing.day", currentDay] },
              },
            },
            isOpen: {
              $anyElementTrue: {
                $map: {
                  input: "$timings",
                  as: "timing",
                  in: {
                    $anyElementTrue: {
                      $map: {
                        input: "$$timing.slots",
                        as: "slot",
                        in: {
                          $and: [
                            { $lte: ["$$slot.openingTime", currentTime] },
                            { $gte: ["$$slot.closingTime", currentTime] },
                            { $eq: ["$$slot.isOpen", true] },
                          ],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          $match: {
            distance: { $lt: maxDistance },
            approved: "approved",
            isActive: true,
            productType: categoryId,
          },
        },
      ]).exec();
      console.log(
        `Found ${nearbyStores.length} stores within ${maxDistance} km.`
      );
      if (nearbyStores.length > 0) break;
    }

    return nearbyStores;
  }


  async updateStoreTimings(
    storeId: string,
    timings: StoreTimingSlot[]
  ): Promise<any> {
    return Store.findByIdAndUpdate(
      storeId,
      { timings },
      { new: true, runValidators: true }
    ).exec();
  }

  async updateStoreImage(storeId: string, imgUrl: string): Promise<any> {
    return Store.findByIdAndUpdate(
      storeId,
      { imgUrl },
      { new: true, runValidators: true }
    ).exec();
  }

  async getStoreDetails(
    storeId: string,
    lat: number,
    lng: number
  ): Promise<any> {
    const store = await Store.findById(storeId).exec();

    if (!store) {
      return null;
    }
    const storesWithDistance = await Store.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat],
          },
          distanceField: "distance",
          spherical: true
        },
      },
      {
        $addFields: {
          distance: { 
            $round: [{ $divide: ["$distance", 1000] }, 2] 
          }
        }
      },
      { $match: { _id: new mongoose.Types.ObjectId(storeId) } },
      { $limit: 1 },
    ]);

    if (storesWithDistance.length === 0) {
      return null;
    }

    const storeWithDistance = storesWithDistance[0];
    const aggregatorStores = await Store.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat],
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: 20000,
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
          aggregatorId: store.aggregatorId,
          _id: { $ne: new mongoose.Types.ObjectId(storeId) },
        },
      },
    ]);

    return {
      store: storeWithDistance,
      deliveryPrice: 0,
      estimatedDeliveryTime: generateEstimatedTime(storeWithDistance.distance),
      aggregatorStores
    };
  }


  async setStoreActiveStatus(
    storeId: string,
    isActive: boolean
  ): Promise<StoreDoc | null> {
    return await Store.findByIdAndUpdate(
      storeId,
      { isActive },
      { new: true }
    ).exec();
  }

  async updateDeviceToken(
    storeId: string,
    deviceId: string
  ): Promise<StoreDoc | null> {
    return await Store.findByIdAndUpdate(storeId, {
      deviceToken: deviceId,
    }).exec();
  }


  async getDeviceId(storeId: string): Promise<any> {
    return await Store.findById(storeId).select('deviceToken').exec();
  }
}

function generateEstimatedTime(distance: number): string {
  const baseTime = 20;
  const extraTimePerKm = 3;

  const minEstimatedTime = baseTime + distance * extraTimePerKm;
  const maxEstimatedTime = minEstimatedTime + 5;

  return `${Math.round(minEstimatedTime)}-${Math.round(
    maxEstimatedTime
  )} minutes`;
}

export const storeRepository = new StoreRepository();

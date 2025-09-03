import { getProductDetailsByMerchantId } from "../kafka/handlers/productDetailsHanddler";
import { getNearByStoreDTO } from "../dtos/StoreDTO";
import { StoreDoc } from "../models/Store";
import { storeRepository } from "../repositories/storeRespository";
import { getSubcategoryDetails } from "../gRPC/controller/subCategoryDetails";
import { Metadata } from "@grpc/grpc-js";
import { configService } from "./configService";
import { applyFilters, applySorting } from "./sortFilterService";

export const getNearByStore = async (
  nearByStoreDTO: getNearByStoreDTO
): Promise<any> => {
  const { lat, lng, name, subCategory, category } = nearByStoreDTO;
  if (lat === undefined || lng === undefined) {
    throw new Error("Latitude and Longitude must be provided.");
  }
  const latitude = Number(lat);
  const longitude = Number(lng);
  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error("Latitude and Longitude must be valid numbers.");
  }
  if (latitude < -90 || latitude > 90) {
    throw new Error("Latitude must be between -90 and 90.");
  }
  if (longitude < -180 || longitude > 180) {
    throw new Error("Longitude must be between -180 and 180.");
  }

  const subCategoryValue = subCategory || "";
  const categoryValue = category || "";

  const storeDetails = await storeRepository.nearbyStores({
    userCoordinates: [longitude, latitude],
    name,
    subCategory: subCategoryValue,
    category: categoryValue,
  });
  
  const config = await configService.getConfigByModelKey("NEARBYSTORE");
  if (!subCategoryValue) {
    return { storeDetails, config: config ? config : {} };
  }

  const metadata = new Metadata();
  const subCategoryDetails = await getSubcategoryDetails(
    subCategoryValue,
    metadata
  );

  return {
    subCategory: { ...subCategoryDetails?.subCategory, _id: subCategoryValue },
    stores: storeDetails,
    config: config ? config : {},
  };
};


export const getNearByStoreWithFilter = async (
  nearByStoreDTO: getNearByStoreDTO
): Promise<any> => {
  const { lat, lng, name, subCategory, category, filters, sort } = nearByStoreDTO;
  if (lat === undefined || lng === undefined) {
    throw new Error("Latitude and Longitude must be provided.");
  }
  const latitude = Number(lat);
  const longitude = Number(lng);
  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error("Latitude and Longitude must be valid numbers.");
  }
  if (latitude < -90 || latitude > 90) {
    throw new Error("Latitude must be between -90 and 90.");
  }
  if (longitude < -180 || longitude > 180) {
    throw new Error("Longitude must be between -180 and 180.");
  }

  const subCategoryValue = subCategory || "";
  const categoryValue = category || "";

  const storeDetails = await storeRepository.nearbyStores({
    userCoordinates: [longitude, latitude],
    name,
    subCategory: subCategoryValue,
    category: categoryValue,
  });
  const config = await configService.getConfigByModelKey("NEARBYSTORE");

  const filteredStores = applyFilters(storeDetails, filters);

  const sortedStores = applySorting(filteredStores, sort);

  if (!subCategoryValue) {
    return { storeDetails: sortedStores, config: config ? config : {} };
  }
  const metadata = new Metadata();
  const subCategoryDetails = await getSubcategoryDetails(subCategoryValue, metadata);
  return {
    subCategory: { ...subCategoryDetails?.subCategory, _id: subCategoryValue },
    stores: sortedStores,
    config: config ? config : {},
  };
};

export const getNearByStoreFilter = async (
  nearByStoreDTO: getNearByStoreDTO
): Promise<any> => {
  const { lat, lng, name, subCategory, category } = nearByStoreDTO;

  if (lat === undefined || lng === undefined) {
    throw new Error("Latitude and Longitude must be provided.");
  }

  const latitude = Number(lat);
  const longitude = Number(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error("Latitude and Longitude must be valid numbers.");
  }

  if (latitude < -90 || latitude > 90) {
    throw new Error("Latitude must be between -90 and 90.");
  }

  if (longitude < -180 || longitude > 180) {
    throw new Error("Longitude must be between -180 and 180.");
  }

  const subCategoryValue = subCategory || "";
  const categoryValue = category || "";

  const storeDetails = await storeRepository.nearbyStores({
    userCoordinates: [longitude, latitude],
    name,
    subCategory: subCategoryValue,
    category: categoryValue,
  });
  
  const config = await configService.getConfigByModelKey("NEARBYSTORE");
  if (!subCategoryValue) {
    return { storeDetails, config: config ? config : {} };
  }

  const metadata = new Metadata();
  const subCategoryDetails = await getSubcategoryDetails(
    subCategoryValue,
    metadata
  );

  return {
    subCategory: { ...subCategoryDetails?.subCategory, _id: subCategoryValue },
    stores: storeDetails,
    config: config ? config : {},
  };
};

export interface StoreWithProducts extends StoreDoc {
  products?: any;
}

export const getNearByStoreWithProduct = async (
  lat: number,
  lng: number,
  categoryId: string,
  customerId: string
): Promise<StoreWithProducts[]> => {
  if (lat === undefined || lng === undefined) {
    throw new Error("Latitude and Longitude must be provided.");
  }
  const latitude = Number(lat);
  const longitude = Number(lng);
  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error("Latitude and Longitude must be valid numbers.");
  }
  if (latitude < -90 || latitude > 90) {
    throw new Error("Latitude must be between -90 and 90.");
  }
  if (longitude < -180 || longitude > 180) {
    throw new Error("Longitude must be between -180 and 180.");
  }

  const stores = await storeRepository.nearbyStoresCategoryWise(
    [longitude, latitude],
    categoryId
  );
  const storesWithProducts: StoreWithProducts[] = await Promise.all(
    stores.map(async (store) => {
      try {
        const productDetails = await getProductDetailsByMerchantId(
          store._id.toString(),
          categoryId,
          customerId
        );
        console.log(productDetails);
        return { ...store, products: productDetails } as any;
      } catch (error) {
        console.error(
          `Failed to fetch products for store ${store._id}:`,
          error
        );
        return { ...store, products: [] } as any;
      }
    })
  );
  return storesWithProducts;
};

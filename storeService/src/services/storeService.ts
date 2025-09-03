import { StoreDoc, StoreTimingSlot } from "../models/Store";
import { storeRepository } from "../repositories/storeRespository";
import { CreateStoreDTO } from "../dtos/StoreDTO";
import { comparePassword, hashPassword } from "../utils/hashedPassword";
import { deliveryChargesRepsoitory } from "../repositories/deliveryChargesRepository";

export const createStore = async (
  storeDto: CreateStoreDTO
): Promise<StoreDoc> => {
  const existingStore = await storeRepository.findByEmail(storeDto.email);
  if (existingStore) {
    throw new Error("A store with this email already exists.");
  }

  const location = {
    type: "Point",
    coordinates: [
      storeDto.lng ? storeDto.lng : 0,
      storeDto.lat ? storeDto.lat : 0,
    ] as [number, number],
  };
  const hashedPassword = await hashPassword(storeDto.password);
  const newStoreData: Partial<StoreDoc> = {
    ...storeDto,
    location,
    password: hashedPassword,
  };
  const createdStore = await storeRepository.createStore(newStoreData);
  const serviceRadius = storeDto.serviceRadius || 5;
  const deliveryPrices = generateDeliveryPrices(
    serviceRadius,
    createdStore._id.toString()
  );
  await deliveryChargesRepsoitory.createMany(deliveryPrices);

  return createdStore;
};

export const getAllStore = async (
  page: number,
  limit: number,
  aggregatorId: string,
  isPagination: string,
  approved:string
): Promise<any> => {
  return await storeRepository.getAllStore(
    page,
    limit,
    aggregatorId,
    isPagination,
    approved
  );
};

export const getStoreById = async (
  storeId: string
): Promise<StoreDoc | null> => {
  return await storeRepository.getStoreById(storeId);
};

export const getStoreDetails = async (
  storeId: string
): Promise<StoreDoc | null> => {
  return await storeRepository.getStoreDetailsById(storeId);
};

export const getstoreByEmail = async (
  email: string
): Promise<StoreDoc | null> => {
  return await storeRepository.findByEmail(email);
};

export const checkPassword = async (
  email: string,
  password: string
): Promise<boolean> => {
  const store = await storeRepository.findByEmail(email);
  if (store) {
    const passwordMatch = await comparePassword(password, store.password);
    return passwordMatch;
  }

  return false;
};

export const updateStoreTimingSlot = async (
  storeId: string,
  timings: StoreTimingSlot[]
) => {
  return storeRepository.updateStoreTimings(storeId, timings);
};

export const updateStoreImage = async (storeId: string, imgUrl: string) => {
  return storeRepository.updateStoreImage(storeId, imgUrl);
};

const generateDeliveryPrices = (serviceRadius: number, storeId: string) => {
  const deliveryPrices = [];

  for (let i = 1; i <= serviceRadius; i += 1) {
    const price = i * 4;
    const time = `${i * 5}`;
    deliveryPrices.push({
      merchantId: storeId,
      name: `${i}`,
      price,
      time,
    });
  }

  return deliveryPrices;
};

export const updateStore = async (
  storeId: string,
  storeDto: Partial<CreateStoreDTO>
): Promise<StoreDoc | null> => {
  const existingStore = await storeRepository.getStoreById(storeId);

  if (!existingStore) {
    throw new Error("Store not found.");
  }

  const updatedData: Partial<StoreDoc> = { ...storeDto };
  if (Number(storeDto.serviceRadius)) {
    const serviceRadius = storeDto.serviceRadius;
    await deliveryChargesRepsoitory.deleteByStoreId(storeId);
    const newDeliveryPrices = generateDeliveryPrices(
      Number(serviceRadius),
      storeId
    );
    await deliveryChargesRepsoitory.createMany(newDeliveryPrices);
  }

  if (storeDto.password) {
    const hashedPassword = await hashPassword(storeDto.password);
    updatedData.password = hashedPassword;
  }

  if (storeDto.lat && storeDto.lng) {
    updatedData.location = {
      type: "Point",
      coordinates: [storeDto.lng, storeDto.lat] as [number, number],
    };
  }

  return await storeRepository.updateStore(storeId, updatedData);
};




export const getStoreDetailsWithBranches = async (
  storeId: string,
  lat:number,
  lng:number
): Promise<any> => {
  return await storeRepository.getStoreDetails(storeId, lat,lng );
};

export const setStoreActiveStatus = async (
  storeId: string,
  isActive: boolean
): Promise<StoreDoc | null> => {
  return await storeRepository.setStoreActiveStatus(
    storeId,
    isActive
  );
};

export const updateDeviceId = async (userId: string, deviceId: string): Promise<StoreDoc | {}> => {
  try {
    const updatedUser = await storeRepository.updateDeviceToken(userId, deviceId);
    return updateStore;
  } catch (error: any) {
    throw new Error(`Error updating deviceId: ${error.message}`);
  }
};
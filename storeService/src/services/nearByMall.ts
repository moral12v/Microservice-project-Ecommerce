import { getNearByMallDTO } from "../dtos/MallDto";
import { mallRepository } from "../repositories/mallRepository";

export const getNearByMall = async (
  nearByMallDTO: getNearByMallDTO
): Promise<any> => {
  const { lat, lng } = nearByMallDTO;
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

  return await mallRepository.nearbyMall([longitude, latitude]);
};

import { Request, Response } from "express";
import {
  checkPassword,
  createStore,
  getAllStore,
  getStoreById,
  getStoreDetails,
  getStoreDetailsWithBranches,
  getstoreByEmail,
  setStoreActiveStatus,
  updateDeviceId,
  updateStore,
  updateStoreImage,
  updateStoreTimingSlot,
} from "../services/storeService";
import { Span, trace } from '@opentelemetry/api';
import {
  CreateStoreDTO,
  getNearByStoreDTO,
  UpdateStoreDTO,
} from "../dtos/StoreDTO";
import {responseWithData,responseWithoutData,errorResponse,} from "../utils/response";
import logger from "../utils/logger";
import {getNearByStore,getNearByStoreWithFilter,getNearByStoreWithProduct,} from "../services/nearByStoreServices";
import { createOrUpdateMerchantAccessToken } from "../services/StoreAccessTokenService";
import { generateAccessToken,generateRefreshToken,verifyToken} from "../services/jwtService";
import { TokenStoreProfile } from "../utils/authValues";

export const registerStoreHandler = async (req: Request, res: Response) => {
  const tracer = trace.getTracer('StoreService');
  const span = tracer.startSpan('registerStoreHandler');
  span.setAttribute("http.method", "POST");
  try {
    const storeDto: CreateStoreDTO = req.body;
    const newStore = await createStore(storeDto);
    responseWithoutData(res, 201, true, "Store created successfully.");
    logger.info(`Store created: ${newStore}`);
  } catch (error: any) {
    logger.error(`Error creating Store: ${error.message}`);
    errorResponse(res, error.message || "Failed to create Store.");
  }
};

export const getAllStoresHandler = async (req: Request, res: Response) => {
  const tracer = trace.getTracer('StoreService');
  const span = tracer.startSpan('getAllStoresHandler');
  span.setAttribute("http.method", "GET");
  try {
    const {
      page = 1,
      limit = 5,
      aggregatorId = "",
      isPagination = true,
      approved = ""
    } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const aggregatorIdString = aggregatorId as string;
    const pagination = isPagination as string;
    const approvedString = approved as string;
    const stores = await getAllStore(
      pageNumber,
      limitNumber,
      aggregatorIdString,
      pagination,
      approvedString
    );
    const response = {
      isPagination: pagination,
      page: pageNumber,
      limit: limitNumber,
      total: stores.total,
      stores: stores.stores,
    };

    responseWithData(res, 200, true, "Stores retrieved successfully", response);
  } catch (error: any) {
    logger.error(`Error retrieving stores: ${error.message}`);
    errorResponse(res, error.message || "Failed to retrieve stores.");
  }
};

export const getStoreByIdHandler = async (req: Request, res: Response) => {
  const tracer = trace.getTracer('StoreService');
  const span = tracer.startSpan('getStoreByIdHandler');
  span.setAttribute("http.method", "GET");
  try {
    const storeId = req.params.id;
    const store = await getStoreById(storeId);
    if (!store) {
      return errorResponse(res, "Store not found", 404);
    }
    responseWithData(res, 200, true, "Store retrieved successfully", store);
  } catch (error: any) {
    logger.error(`Error retrieving store: ${error.message}`);
    errorResponse(res, error.message || "Failed to retrieve store.");
  }
};

export const getNearByStoreHandler = async (req: Request, res: Response) => {
  const tracer = trace.getTracer('StoreService');
  const span = tracer.startSpan('getNearByStoreHandler');
  span.setAttribute("http.method", "GET");
  try {
    const nearByStoreDTO: getNearByStoreDTO = req.query;
    const store = await getNearByStore(nearByStoreDTO);
    
    if (!store) {
      return responseWithData(res, 404, true, "Store Not Found", store);
    }

    responseWithData(
      res,
      200,
      true,
      "Store details retrieved successfully",
      store
    );
  } catch (error: any) {
    logger.error(`Error retrieving store details: ${error.message}`);
    errorResponse(res, error.message || "Failed to retrieve store details.");
  }
};

export const getNearByStoreFilterHandler = async (req: Request, res: Response) => {
  const tracer = trace.getTracer('StoreService');
  const span = tracer.startSpan('getNearByStoreHandler');
  span.setAttribute("http.method", "GET");
  try {
    const nearByStoreDTO: getNearByStoreDTO = req.body;
    const store = await getNearByStoreWithFilter(nearByStoreDTO);
    
    if (!store) {
      return responseWithData(res, 404, true, "Store Not Found", store);
    }

    responseWithData(
      res,
      200,
      true,
      "Store details retrieved successfully",
      store
    );
  } catch (error: any) {
    logger.error(`Error retrieving store details: ${error.message}`);
    errorResponse(res, error.message || "Failed to retrieve store details.");
  }
};

export const storeLoginHandler = async (req: Request, res: Response) => {
  const tracer = trace.getTracer('StoreService');
  const span = tracer.startSpan('storeLoginHandler');
  span.setAttribute("http.method", "POST");
  try {
    const { email, password } = req.body;
    const store = await getstoreByEmail(email);
    if (!store) {
      responseWithoutData(res, 404, false, "Store not found");
    } else {
      const passwordMatch = await checkPassword(email, password);
      if (!passwordMatch) {
        responseWithoutData(res, 401, false, "Invalid credentials");
      } else {
        const storeId = store?._id;
        const accessToken = generateAccessToken(storeId.toString());
        const refreshToken = generateRefreshToken(storeId.toString());
        const device: any = req.headers["x-device"] || "Unknown";
        const ip = req.ip || "Unknown";
        const token = await createOrUpdateMerchantAccessToken(
          storeId,
          device,
          ip,
          accessToken,
          refreshToken
        );
        responseWithData(res, 200, true, "Login Successful", {
          token: token,
          loginType: "store",
        });
      }
    }
  } catch (error: any) {
    console.error(`Error during Merchant login: ${error.message}`);
    errorResponse(res, error.message || "Failed to log in.");
  }
};

export const getNearByStoreWithProductHandler = async (
  req: Request,
  res: Response
) => {
  const traceId = req.traceId;
  const span: Span | undefined = req.span;

  try {
    const customerId = req.customer ? req.customer._id : "";
    const { lat, lng, categoryId } = req.query;

    const latitude = Number(lat);
    const longitude = Number(lng);
    const category = categoryId as string;

    const store = await getNearByStoreWithProduct(latitude, longitude, category, customerId);

    if (store.length === 0) {
      if (span) span.end();
      return responseWithData(res, 404, true, "Store Not Found", store);
    }

    if (span) span.end();
    responseWithData(res, 200, true, "Store details retrieved successfully", store);
  } catch (error: any) {
    if (span) span.end();
    errorResponse(res, error.message || "Failed to retrieve store details.");
  }
};




export const getAllAggregatortStoresHandler = async (
  req: Request,
  res: Response
) => {
  const tracer = trace.getTracer('StoreService');
  const span = tracer.startSpan('getAllAggregatortStoresHandler');
  span.setAttribute("http.method", "GET");
  try {
    const {
      page = 1,
      limit = 5,
      aggregatorId = "",
      isPagination = true,
    } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const aggregatorIdString = aggregatorId as string;
    const pagination = isPagination as string;
    const stores = await getAllStore(
      pageNumber,
      limitNumber,
      aggregatorIdString,
      pagination,
      ""
    );
    const response = {
      isPagination: pagination,
      page: pageNumber,
      limit: limitNumber,
      total: stores.total,
      stores: stores.stores,
    };

    responseWithData(res, 200, true, "Stores retrieved successfully", response);
  } catch (error: any) {
    logger.error(`Error retrieving stores: ${error.message}`);
    errorResponse(res, error.message || "Failed to retrieve stores.");
  }
};

export const registerStoreFOrAggregatorHandler = async (
  req: Request,
  res: Response
) => {
  const tracer = trace.getTracer('StoreService');
  const span = tracer.startSpan('registerStoreFOrAggregatorHandler');
  span.setAttribute("http.method", "POST");
  try {
    const aggregatorId = req.user ? req.user._id : "";
    const storeDto: CreateStoreDTO = {
      ...req.body,
      aggregatorId,
    };
    const newStore = await createStore(storeDto);
    responseWithoutData(res, 201, true, "Store created successfully.");
    logger.info(`Store created: ${newStore}`);
  } catch (error: any) {
    logger.error(`Error creating Store: ${error.message}`);
    errorResponse(res, error.message || "Failed to create Store.");
  }
};

export const getAllAggregatortStoresFOrAggregatorHandler = async (
  req: Request,
  res: Response
) => {
  const tracer = trace.getTracer('StoreService');
  const span = tracer.startSpan('getAllAggregatortStoresFOrAggregatorHandler');
  span.setAttribute("http.method", "GET");
  try {
    const { page = 1, limit = 5, isPagination = true } = req.query;
    const aggregatorId = req.user ? req.user._id : "";
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const aggregatorIdString = aggregatorId as string;
    const pagination = isPagination as string;
    const stores = await getAllStore(
      pageNumber,
      limitNumber,
      aggregatorIdString,
      pagination,
      ""
    );
    const response = {
      isPagination: pagination,
      page: pageNumber,
      limit: limitNumber,
      total: stores.total,
      stores: stores.stores,
    };

    responseWithData(res, 200, true, "Stores retrieved successfully", response);
  } catch (error: any) {
    logger.error(`Error retrieving stores: ${error.message}`);
    errorResponse(res, error.message || "Failed to retrieve stores.");
  }
};

export const updateStoreTimingSlotHandler = async (
  req: Request,
  res: Response
) => {
  const tracer = trace.getTracer('StoreService');
  const span = tracer.startSpan('updateStoreTimingSlotHandler');
  span.setAttribute("http.method", "PATCH");
  const { storeId } = req.params;
  const timings = req.body.timings;

  try {
    const updatedStore = await updateStoreTimingSlot(storeId, timings);

    responseWithData(
      res,
      200,
      true,
      "Store timings updated successfully",
      updatedStore
    );
  } catch (error: any) {
    logger.error(`Error updating store timings: ${error.message}`);
    errorResponse(res, error.message || "Failed to update store timings.");
  }
};

export const updateStoreImageHandler = async (req: Request, res: Response) => {
  const tracer = trace.getTracer('StoreService');
  const span = tracer.startSpan('updateStoreTimingSlotHandler');
  span.setAttribute("http.method", "PATCH");
  const { storeId } = req.params;
  const imgUrl = req.body.imgUrl;

  try {
    const updatedStore = await updateStoreImage(storeId, imgUrl);

    responseWithData(
      res,
      200,
      true,
      "Store image updated successfully",
      updatedStore
    );
  } catch (error: any) {
    logger.error(`Error updating store image: ${error.message}`);
    errorResponse(res, error.message || "Failed to update store image.");
  }
};

export const updateStoreHandler = async (req: Request, res: Response) => {
  const tracer = trace.getTracer('StoreService');
  const span = tracer.startSpan('updateStoreTimingSlotHandler');
  span.setAttribute("http.method", "PATCH");
  try {
    const { storeId } = req.params;
    const storeDto: Partial<CreateStoreDTO> = req.body;

    const updatedStore = await updateStore(storeId, storeDto);

    if (!updatedStore) {
      return errorResponse(res, "Store not found.", 404);
    }

    responseWithData(
      res,
      200,
      true,
      "Store updated successfully",
      updatedStore
    );
  } catch (error: any) {
    logger.error(`Error updating store: ${error.message}`);
    errorResponse(res, error.message || "Failed to update store.");
  }
};

export const getStoreDetailsWithBranchesHandler = async (
  
  req: Request,
  res: Response
) => {
  const tracer = trace.getTracer('StoreService');
  const span = tracer.startSpan('getStoreDetailsWithBranchesHandler');
  span.setAttribute("http.method", "GET");
  try {
    const { lat, lng } = req?.query;

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
    const storeId = req.params.id;
    const store = await getStoreDetailsWithBranches(storeId, latitude, longitude);
    if (store.length === 0) {
      return responseWithData(res, 404, true, "Store Not Found", store);
    }

    responseWithData(
      res,
      200,
      true,
      "Store details retrieved successfully",
      store
    );
  } catch (error: any) {
    logger.error(`Error retrieving store details: ${error.message}`);
    errorResponse(res, error.message || "Failed to retrieve store details.");
  }
};

export const getStoreProfileHandler = async (req: Request, res: Response) => {
  const tracer = trace.getTracer('StoreService');
  const span = tracer.startSpan('getStoreProfileHandler');
  span.setAttribute("http.method", "GET");
  try {
    const token = req.headers['authorization'];
    if (!token) {
      return responseWithoutData(res, 401, false, 'Missing Authorization Token');
    }
    const storeId: any = await verifyToken(token);
    if (!storeId) {
      return responseWithoutData(res, 401, false, 'Invalid Authorization Token');
    }
    const storeProfile = await getStoreById(storeId);
    if (!storeProfile) {
      return responseWithoutData(res, 404, false, 'Store not found');
    }
    responseWithData(res, 200, true, 'Store profile retrieved successfully', storeProfile);
  } catch (error: any) {
    logger.error(`Error retrieving Store profile: ${error.message}`);
    if (!res.headersSent) {
      errorResponse(res, error.message || 'Failed to retrieve Store profile.');
    }
  }
};

export const setStoreActiveStatusHandler = async (
  req: Request,
  res: Response
) => {
  const tracer = trace.getTracer('StoreService');
  const span = tracer.startSpan('setStoreActiveStatusHandler');
  span.setAttribute("http.method", "PATCH");
  try {
    const storeId = req.params.id;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return errorResponse(res, "Invalid value for isActive, must be a boolean.", 400);
    }

    const updatedStore = await setStoreActiveStatus(
      storeId,
      isActive
    );

    if (!updatedStore) {
      return errorResponse(res, "Store not found", 404);
    }

    responseWithData(
      res,
      200,
      true,
      `Store ${isActive ? "opened" : "closed"} successfully`,
      updatedStore
    );
  } catch (error: any) {
    logger.error(`Error updating store status: ${error.message}`);
    errorResponse(res, error.message || "Failed to update store status.");
  }
};

export const updateStoreDeviceId = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers['authorization'] as string;
    const token = req.headers['authorization'];
    if (!token) {
      return responseWithoutData(res, 401, false, 'Missing Authorization Token');
    }

    const store: any = await TokenStoreProfile(token);
    if (!store) {
      return responseWithoutData(res, 401, false, 'Invalid Authorization Token');
    }
    const { deviceId } = req.body;
    if (!deviceId) {
      return responseWithoutData(res, 400, false, 'Device ID is required');
    }
    const updatedStore = await updateDeviceId(store._id, deviceId);
    if (!updatedStore) {
      return responseWithoutData(res, 404, false, 'User not found');
    }
    return responseWithoutData(res, 200, true, 'Device Token has been Updated Successfully!');
  } catch (error: any) {
    logger.error(`Error updating deviceId: ${error.message}`);
    errorResponse(res, error.message || 'Internal Server Error.');
  }
};
import { Request, Response } from "express";
import {
  getAllMalls,
  getMallById,
  createMall,
  updateMall,
  deleteMall,
} from "../services/mallServices";
import { trace } from '@opentelemetry/api';
import { getNearByMallDTO } from "../dtos/MallDto";
import {
  errorResponse,
  responseWithData,
  responseWithoutData,
} from "../utils/response";
import logger from "../utils/logger";
import { getNearByMall } from "../services/nearByMall";

export const createMallController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const tracer = trace.getTracer('StoreService');
  const span = tracer.startSpan('createMallController');
  span.setAttribute("http.method", "POST");
  const newMall = req.body;

  try {
    const createdMall = await createMall(newMall);
    responseWithData(res, 201, true, "Mall created successfully", createdMall);
  } catch (error) {
    responseWithoutData(res, 400, false, "Invalid data provided");
  }
};

export const getAllMallsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const tracer = trace.getTracer('StoreService');
  const span = tracer.startSpan('getAllMallsController');
  span.setAttribute("http.method", "GET");
  try {
    const malls = await getAllMalls();
    if (malls?.length === 0) {
      responseWithData(res, 200, true, "No malls found", malls);
    } else {
      responseWithData(res, 200, true, "Malls retrieved successfully", malls);
    }
  } catch (error) {
    responseWithoutData(res, 500, false, "Internal Server Error");
  }
};

export const getMallByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const tracer = trace.getTracer('StoreService');
  const span = tracer.startSpan('getMallByIdController');
  span.setAttribute("http.method", "GET");
  const { mallId } = req.params;

  try {
    const mall = await getMallById(mallId);
    if (mall) {
      responseWithData(
        res,
        200,
        true,
        "Mall details retrieved successfully",
        mall
      );
    } else {
      responseWithData(res, 200, true, "No malls found", mall);
    }
  } catch (error) {
    responseWithoutData(res, 500, false, "Internal Server Error");
  }
};

export const updateMallController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const tracer = trace.getTracer('StoreService');
  const span = tracer.startSpan('updateMallController');
  span.setAttribute("http.method", "PATCH");
  const { mallId } = req.params;
  const updateData = req.body;

  try {
    const updatedMall = await updateMall(mallId, updateData);
    if (updatedMall) {
      responseWithData(
        res,
        200,
        true,
        "Mall updated successfully",
        updatedMall
      );
    } else {
      responseWithoutData(res, 404, false, "Mall not found");
    }
  } catch (error) {
    responseWithoutData(res, 400, false, "Invalid data provided");
  }
};

export const deleteMallController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const tracer = trace.getTracer('StoreService');
  const span = tracer.startSpan('deleteMallController');
  span.setAttribute("http.method", "DELETE");
  const { mallId } = req.params;

  try {
    const deletedMall = await deleteMall(mallId);
    if (deletedMall) {
      responseWithoutData(res, 200, true, "Mall deleted successfully");
    } else {
      responseWithoutData(res, 404, false, "Mall not found");
    }
  } catch (error) {
    responseWithoutData(res, 500, false, "Internal Server Error");
  }
};

export const getNearByStoreHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const tracer = trace.getTracer('StoreService');
  const span = tracer.startSpan('getNearByStoreHandler');
  span.setAttribute("http.method", "POST");
  try {
    const nearByMallDTO: getNearByMallDTO = req.query;
    const malls = await getNearByMall(nearByMallDTO);
    if (malls.length === 0) {
      responseWithoutData(res, 404, false, "mall not found");
    } else {
      responseWithData(
        res,
        200,
        true,
        "Store details retrieved successfully",
        malls
      );
    }
  } catch (error: any) {
    responseWithoutData(res, 500, false, "Failed to retrieve store details");
  }
};

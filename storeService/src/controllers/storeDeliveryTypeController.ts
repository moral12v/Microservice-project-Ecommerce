import { Request, Response } from 'express';
import {
  getAllStoreDeliveryType,
  getStoreDeliveryTypeById,
  createStoreDeliveryType,
  updateStoreDeliveryType,
  deleteStoreDeliveryType,
} from "../services/storeDeliveryTypeService"
import { trace } from '@opentelemetry/api';

export const getAllDeliveryTypes = async (req: Request, res: Response) => {
  const tracer = trace.getTracer('StoreService');
  const span = tracer.startSpan('getAllDeliveryTypes');
  span.setAttribute("http.method", "GET");
  try {
    const deliveryTypes = await getAllStoreDeliveryType();
    res.json(deliveryTypes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getDeliveryTypeById = async (req: Request, res: Response) => {
  const tracer = trace.getTracer('StoreService');
  const span = tracer.startSpan('getDeliveryTypeById');
  span.setAttribute("http.method", "GET");
  const { storeId } = req.params;

  try {
    const deliveryType = await getStoreDeliveryTypeById(storeId);
    if (deliveryType) {
      res.json(deliveryType);
    } else {
      res.status(404).json({ message: 'Delivery Type not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const createDeliveryType = async (req: Request, res: Response): Promise<void> => {
  const tracer = trace.getTracer('StoreService');
  const span = tracer.startSpan('createDeliveryType');
  span.setAttribute("http.method", "POST");
  const newDeliveryType = req.body;

  try {
    const createdDeliveryType = await createStoreDeliveryType(newDeliveryType);
    res.status(201).json(createdDeliveryType);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid data provided' }); 
  }
};

export const updateDeliveryType = async (req: Request, res: Response): Promise<void> => {
  const tracer = trace.getTracer('StoreService');
  const span = tracer.startSpan('updateDeliveryType');
  span.setAttribute("http.method", "PATCH");
  const { storeId } = req.params;
  const updateData = req.body;

  try {
    const updatedDeliveryType = await updateStoreDeliveryType(storeId, updateData);
    if (updatedDeliveryType) {
      res.json(updatedDeliveryType);
    } else {
      res.status(404).json({ message: 'Delivery Type not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid data provided' }); 
  }
};

export const deleteDeliveryType = async (req: Request, res: Response): Promise<void> => {
  const tracer = trace.getTracer('StoreService');
  const span = tracer.startSpan('deleteDeliveryType');
  span.setAttribute("http.method", "DElETE");
  const { storeId } = req.params;

  try {
    const deletedDeliveryType = await deleteStoreDeliveryType(storeId);
    if (deletedDeliveryType) {
      res.json({ message: 'Delivery Type deleted' });
    } else {
      res.status(404).json({ message: 'Delivery Type not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

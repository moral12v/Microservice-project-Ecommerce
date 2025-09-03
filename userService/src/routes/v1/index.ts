import express from 'express';
import cors from 'cors';
import { customerRoutes } from './customerRoute';
import { vendorRoute } from './vendorRoutes';
import { adminRoute } from './adminRoutes';
import { addressRoute } from './addressRoute';
import { bannerRoute } from './bannerRoute';
import { uploaderRoute } from './uploadRoute';

export const v1Api = express.Router();

v1Api.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

/****************************
    UNAUTHENTICATED ROUTES
****************************/
v1Api.use('/customer', customerRoutes);
v1Api.use('/vendor', vendorRoute);
v1Api.use('/admin', adminRoute);
v1Api.use('/address', addressRoute);
v1Api.use('/banner', bannerRoute);
v1Api.use('/upload', uploaderRoute);

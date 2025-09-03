import express from 'express';
import { v1Api } from './v1';

const routes = express.Router();

routes.use('/v1', v1Api);

export default routes;

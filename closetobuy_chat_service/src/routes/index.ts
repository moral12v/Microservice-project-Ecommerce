import express from 'express';
import router from './v1/chatRoutes';

const routes = express.Router();


routes.use('/v1',router)
export default routes;

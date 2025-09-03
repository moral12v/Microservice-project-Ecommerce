import express from "express";
import InvoiceController from "../../controllers/invoiceController";
import { merchantAuthentication } from "../../middlewares/validateMerchant";
export const invoiceRoute = express.Router();

invoiceRoute.post("/", InvoiceController.createInvoice);
invoiceRoute.get("/", InvoiceController.getAllInvoices);
invoiceRoute.get("/merchant/:id",merchantAuthentication,  InvoiceController.getInvoicesByMerchantId);
invoiceRoute.get("/customer/:id",merchantAuthentication, InvoiceController.getInvoicesByCustomerId);


// orderServiceRoute.get("/:id", orderServiceController.getAllOrderservice);
// orderServiceRoute.patch("/:id", orderServiceController.updateOrderservice);

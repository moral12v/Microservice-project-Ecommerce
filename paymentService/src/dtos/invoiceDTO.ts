export interface CreateInvoiceDTO {
    id: number;
    invoiceNumber: number;
    orderId: number;
    merchantId: number;
    customerId: number;
    orderDetailId: number;
    userId: number;
    totalPayment: number;
    gst: number;
    Date: Date;
    createdAt: Date;
    updatedAt: Date;
   
}

export interface UpdateInvoiceDTO {
    id: number;
    invoiceNumber: number;
    orderId: number;
    merchantId: number;
    customerId: number;
    orderDetailId: number;
    userId: number;
    totalPayment: number;
    gst: number;
    Date: Date;
    createdAt: Date;
    updatedAt: Date;
}
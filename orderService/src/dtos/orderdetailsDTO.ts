export interface CreateOrderDetailsDTO {
    orderId: number;
    branchId: number;
    productId: number;
    productVariantId: number;
    categoryId: number;
    subCategoryId: number;
    deliveryTypeId: number;
    price: number;
    orderStatusId: number;
    trackingId: string;
    trackingLink: string;
    accepted: boolean;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

   
export interface UpdateOrderDetailsDTO {
    orderId: number;
    branchId?: number;
    productId?: number;
    productVariantId?: number;
    categoryId?: number;
    subCategoryId?: number;
    deliveryTypeId?: number;
    price?: number;
    orderStatusId?: number;
    trackingId?: string;
    trackingLink?: string;
    accepted?: boolean;
    quantity?: number;
}

   
  
enum OrderStatus {
  PENDING,
  COMPLETED,
  CANCELED,
}


export interface CreateOrderDTO {
  addressId: string;
  cartId: string;
  orderItems: OrderItemDTO[];
  merchantId:any,
  userId:string,
  deliveryType?:string
  couponCode?:string;
}
export interface UpdateOrderDTO {
  orderId: number;
  status: any;
  userId: number;
  totalAmount: number;
}
export interface FilterOrdersDTO {
  statusId?: string;
  page?: number;
  limit?: number;
  isPagination?: boolean;
  // merchantId: string;
  // deliveryTypeId: string;
}


interface AddonDTO {
  groupName: string;
  choices: {
    choiceName: string;
    choicePrice: number;
  }[];
}

export interface OrderItemDTO {
  productId: string;
  productName: string;
  quantity: number;
  sellingPrice: number;
  actualPrice: number;
  packagingCharge?: number;
  addons?: AddonDTO[];
}

export interface PlaceOrderDTO {
  statusId:number;
  cartId:string
  orderId: string;
  userId: string;
  merchantId: string;
  addressId: string;
  subTotalAmount: number;
  totalAmount: number;
  shippingAmount: number;
  gst: number;
  discount: number;
  packingCharges?: number;
  convenienceCharges?: number;
  scheduleOrderDate?: any;
  deliveryTypeId?: string;
  couponCode?: string;
  orderItems: OrderItemDTO[];
}

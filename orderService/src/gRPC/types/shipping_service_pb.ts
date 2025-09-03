export interface CreateTaskRequest {
  orderDetails: OrderDetails;  
  pickupDetails: PickupDetails;  
  dropDetails: DropDetails;  
  orderItems: OrderItem[];  
  traceId: string;  
  spanId: string;  
}

export interface CreateTaskResponse {
  taskId: string;  
  status: string;  
  message: string;  
  trackLink: string;  
  traceId: string;  
  spanId: string;  
}

export interface OrderDetails {
  orderId: string;  
  userId: string;  
  merchantId: string;  
  subTotalAmount: number;  
  totalAmount: number;  
  shippingAmount: number;  
  gst: number;  
  discount: number;  
  status: string;  
  vendor_order_id: string;  
  order_total: number;  
  order_source: string;  
}

export interface PickupDetails {
  name: string;  
  contact_number: string;  
  address: string;  
  city: string;  
  latitude: number;  
  longitude: number;  
}

export interface DropDetails {
  name: string;  
  contact_number: string;  
  address: string;  
  city: string;  
  latitude: number;  
  longitude: number;  
}

export interface OrderItem {
  productId: string;  
  productName: string;  
  quantity: number;  
  sellingPrice: number;  
  actualPrice: number;  
  addons: Addon[];  
}

export interface Addon {
  groupName: string;  
  choices: Choice[];  
}

export interface Choice {
  choiceName: string;  
  choicePrice: number;  
}

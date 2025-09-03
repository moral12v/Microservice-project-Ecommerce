export interface OrderDetailsRequest {
  orderId: string;
  traceId?: string;
  spanId?: string;
}

export interface OrderDetailsResponse {
  success: boolean;
  message: string;
  order?: OrderData;
  traceId?: string;
  spanId?: string;
}

export interface OrderData {
  _id: string;
  orderStatus: OrderStatus;
  merchantDetails: MerchantData;
  customerDetails: CustomerData;
  addressDetails: AddressData;
  deliveryTypeDetails: DeliveryData;
  orderItems: OrderItem[];
}

export interface OrderStatus {
  id: number;
  name: string;
  image: string;
}

export interface OrderItem {
  id: number;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  sellingPrice: number;
  actualPrice: number;
  tax?: number;
  packagingCharge?: number;
  createdAt: string;
  updatedAt: string;
  addons: Addon[];
}

export interface Addon {
  id: number;
  orderItemId: number;
  groupName: string;
  choices: AddonChoice[];
}

export interface AddonChoice {
  choiceName: string;
  choicePrice: number;
}

export interface MerchantData {
  _id: string;
  name: string;
  mobile: string;
  email: string;
  imgUrl?: string;
  pincode?: string;
  area?: string;
  city?: string;
  state?: string;
  country?: string;
  location?: Location;
}

export interface Location {
  type: string;
  coordinates: number[];
}

export interface CustomerData {
  _id: string;
  name: string;
  mobile: string;
}

export interface AddressData {
  _id: string;
  addType: string;
  add1: string;
  city: string;
  state: string;
  country: string;
  mobile: string;
  zipcode: string;
}

export interface DeliveryData {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

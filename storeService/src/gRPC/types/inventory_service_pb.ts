export interface AddonChoice {
  choiceName: string;
  choicePrice: number;
}

export interface AddonGroup {
  groupName: string;
  choices: AddonChoice[];
}

export interface ProductDetails {
  productId: string;
  name: string;
  imgUrl?: string;
  price: number;
  actualPrice: number;
  cartQuantity: number;
  weight: number;
  packagingCharge: number;
  addons: AddonGroup[];
}

export interface DeliveryTypeDetails {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CouponDetails {
  couponCode: string;
  discountAmount: number;
  isValid: boolean;
  message?: string;
}

export interface PriceDetails {
  products: ProductDetails[];
  subTotal: number;
  gstCost: number;
  grandTotal: number;
  actualPrice: number;
  productPrice: number;
  deliveryCharge: number;
  totalAmount: number;
  savedAmount: number;
  discount: number;
  packagingCharge: number;
  platformFee: number;
  merchantName: string;
  merchantId: string;
  deliveryTypes: DeliveryTypeDetails[]; 
  scheduledOrder: boolean;
  cartId: string;
  couponIsValid?: boolean;
  couponDetails?: CouponDetails;
  selectedDeliveryType?: DeliveryTypeDetails;
}

export interface PriceDetailsRequest {
  cartId: string;
  customerId: string;
  deliveryType: string;
  couponCode?: string;
  addressId?: string; 
  traceId?: string; 
  spanId?: string;  
}

export interface PriceDetailsResponse {
  success: boolean;
  message: string;
  data?: PriceDetails;  
  traceId?: string;      
  spanId?: string;       
}

export interface SubCategoryDetails {
  _id: string;
  name: string;
  imageUrl: string;
  isActive: boolean;
  description: string;
  imageUrlLarge?: string;
}

export interface SubCategoryDetailsRequest {
  subCategoryId: string;
  traceId?: string;
  spanId?: string;
}

export interface SubCategoryDetailsResponse {
  success: boolean;
  message: string;
  subCategory?: SubCategoryDetails;
  traceId?: string;
  spanId?: string;
}

export interface GetAveragePriceRequest {
  merchantId: string;    
  traceId?: string;          
  spanId?: string;          
}

export interface GetAveragePriceResponse {
  success: boolean;          
  message: string;          
  averageSellingPrice?: number;  
  traceId?: string;           
  spanId?: string;          
}

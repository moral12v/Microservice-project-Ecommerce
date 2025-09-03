export interface MerchantData {
  _id: string;
  name: string;
  mobile?: string;
  email?: string;
  address?: string;
  timings?: StoreTiming[]; 
  imgUrl?: string;
  isOpen?: boolean;
  scheduledOrder?: boolean;
  freeDelivery?: boolean;
  pincode?: string;
  landmark?: string;
  location?: {
    type: string;
    coordinates: [number, number]; 
  };
  gstNumber?: string;
  area?: string;
  city?: string;
  state?: string;
  country?: string;
  vendorId?: string;
  negotiation?: boolean;
  exchange?: boolean;
  isActive?: boolean;
  packingCharges?: string;
  deliveryTypes?: string[];
}


export interface StoreTiming {
  day: string;
  slots: StoreTimingSlot[];
}


export interface StoreTimingSlot {
  openingTime: string;
  closingTime: string;
  isOpen: boolean;
}


export interface MerchantAuthRequest {
  token: string;
  traceId?: string;
  spanId?: string;
}


export interface MerchantAuthResponse {
  success: boolean;
  message: string;
  merchantData?: MerchantData;
  isValid?: boolean;
  traceId?: string;
  spanId?: string;
}

export interface MerchantDetailsRequest {
  merchantId: string;    
  traceId?: string;       
  spanId?: string;      
}


export interface MerchantDetailsResponse {
  success: boolean;
  message: string;
  merchantData?: MerchantData;  
  traceId?: string;            
  spanId?: string;             
}

export interface DeliveryData {
  _id: string;            
  name: string;               
  isActive: boolean;        
  createdAt: string;          
  updatedAt: string;  
}
export interface DeliveryDetailsRequest {
  deliveryId: string; 
  traceId?: string; 
  spanId?: string; 
}

export interface DeliveryDetailsResponse {
  success: boolean; 
  message: string;
  deliveryData?: DeliveryData;
  traceId?: string; 
  spanId?: string; 
}
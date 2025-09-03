

export interface MerchantData {
  _id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  timings?: []; 
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
  merchantData?: any;  
  traceId?: string;           
  spanId?: string;             
}
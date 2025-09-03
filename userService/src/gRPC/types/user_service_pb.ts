export interface CustomerData {
  _id: string;           
  fullName: string;      
  mobile: string;        
}

export interface AuthRequest {
  token: string;         
  traceId?: string;      
  spanId?: string;      
}

export interface AuthResponse {
  success: boolean;      
  message: string;      
  customerData?: CustomerData;
  isValid?: boolean;     
  traceId?: string;      
  spanId?: string;      
}



export interface VendorAuthRequest {
  token: string;       
  traceId?: string;      
  spanId?: string;       
}

export interface VendorAuthResponse {
  success: boolean;     
  message: string;       
  vendorData?: CustomerData; 
  isValid?: boolean;   
  traceId?: string;      
  spanId?: string;     
}


export interface CustomerDetailsRequest {
  customerId: string;    
  traceId?: string;      
  spanId?: string;       
}


export interface CustomerDetailsResponse {
  success: boolean;     
  message: string;      
  customerData?: CustomerData; 
  traceId?: string;      
  spanId?: string;     
}

export interface AddressData {
  _id: string;
  customerId: string;
  addType: string;
  add1: string;
  add2?: string;
  city: string;
  state: string;
  country: string;
  area?: string;
  landmark?: string;
  fullName?: string;
  mobile?: string;
  lat?: number;
  lng?: number;
  zipcode: string;
}

export interface AddressDetailsRequest {
  addressId: string;
  traceId?: string;
  spanId?: string;
}

export interface AddressDetailsResponse {
  success: boolean;
  message: string;
  addressData?: AddressData;
  traceId?: string;
  spanId?: string;
}

export interface DeviceDetailsRequest {  
  customerId: string; 
}

export interface DeviceDetailsResponse {  
  success: boolean;  
  message: string; 
  deviceId?: string;
}
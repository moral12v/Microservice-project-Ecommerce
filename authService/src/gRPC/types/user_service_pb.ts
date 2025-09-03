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

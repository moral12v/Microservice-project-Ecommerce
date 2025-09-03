enum CouponStatus {
    PENDING,
    COMPLETED,
    CANCELED
  }
  
export interface CreateCouponDTO {
  id: number;      
  orderId:number;       
  userId:number;           
  status:any;        
  couponCode: number;        
  totalAmount: number;       
  createdAt: Date;
  updatedAt:Date;                       
  
}
    
export interface UpdateCouponDTO {
  id: number;      
  orderId:number;       
  userId:number;           
  status:any;        
  couponCode: number;        
  totalAmount: number;       
  createdAt: Date;
  updatedAt:Date;    
}
export interface FilterCouponDTO {
  isActive?: boolean;
}
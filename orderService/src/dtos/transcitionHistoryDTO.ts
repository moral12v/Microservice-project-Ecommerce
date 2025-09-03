export interface CreateTranscitionHistoryDTO {
    transactionId: number;
    merchantId: number;
    amountPaid: number;        
    planPrice: number;          
    gstAmount: number;           
    paymentRefId: number;        
    userId: number; 
    userType: boolean;                             
    subscriptionStartDate: Date;
    subscriptionEndDate: Date;   
    planId: number;              
   
  }
  
  export interface UpdateTranscitionHistoryDTO {
    transactionId: number;
    merchantId: number;
    amountPaid: number;        
    planPrice: number;          
    gstAmount: number;           
    paymentRefId: number;        
    userId: number;                
    userType: boolean;             
    subscriptionStartDate: Date;
    subscriptionEndDate: Date;   
    planId: number;              
  }
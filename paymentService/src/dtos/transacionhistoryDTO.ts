export interface CreateTranscitionHistoryDTO {
    userId: string;
    merchantId: string;
    amount: number;  
    currency: string;
    type: string;
    status: string;
    paymentMethod: string;
    referenceId: string;
    description: string;
    orderId: any;
    paymentOrderId: string;
    aggregatorStatus?: string;
 
  }
  export interface UpdateTranscitionHistoryDTO {
    id?:string;
    userId: string;
    amount: number;  
    currency: string;
    type: string;
    status: string;
    paymentMethod: string;
    referenceId: string;
    description: string;
    orderId: any;
    paymentOrderId: string;
    aggregatorStatus?: string;
    paid_amount?: number;    
    paid_date?: string;         
    reason?: string;   
  }

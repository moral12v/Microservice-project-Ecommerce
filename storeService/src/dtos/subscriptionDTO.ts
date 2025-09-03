export interface createSubscriptionDTO{
    id: string;
 subscriptionId: string;
 amountPaid: number;
 planPrice: number;
 gstAmount: number;
 paymentRefId: string;
 userId: string;
 userType: string;
 subscriptionStartDate: string;
 subscriptionEndDate: string;
 planId: string;
 
}

export interface UpdateSubscriptionDTO{
    id: string;
 subscriptionId: string;
 amountPaid: number;
 planPrice: number;
 gstAmount: number;
 paymentRefId: string;
 userId: string;
 userType: string;
 subscriptionStartDate: string;
 subscriptionEndDate: string;
 planId: string;
 
}
export interface ViewedProductDTO {
    productId: string;  
    viewedAt?: Date;   
}

export interface RecentViewedProductsDTO {
    customerId: string;          
    products: ViewedProductDTO[]; 
}
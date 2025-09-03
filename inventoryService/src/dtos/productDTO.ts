export interface CreateProductDTO {
    packingCharge: number;
    name: string;
    hasTime: boolean;
    openTime?: string;
    closeTime?: string; 
    description: string;
    approve: boolean;
    storeId: object;
    available: boolean;
    soldCount: number;
    quantity: number;
    tags: string;
    isActive: boolean;
    price: number;
    comparePrice: number;
    gst: number;
    freeDelivery: boolean;
    freeDeliveryIfMore?: number; 
    categoryId: string; 
    objectIdsize?: string; 
    foodType?: string; 
    width?: number; 
    length?: number; 
    weight?: number; 
    vendorId: object;
     active?: boolean; 
    approvedByAdmin?: boolean;
}
    
export interface UpdateProductDTO {
    packingCharge?: number;
    name?: string;
    hasTime?: boolean;
    openTime?: string;
    closeTime?: string; 
    description?: string;
    approve?: boolean;
    storeId?: object;
    available?: boolean;
    soldCount?: number;
    quantity?: number;
    tags?: string;
    isActive?: boolean;
    price?: number;
    comparePrice?: number;
    gst?: number;
    freeDelivery?: boolean;
    freeDeliveryIfMore?: number; 
    categoryId?: string; 
    objectIdsize?: string; 
    foodType?: string; 
    width?: number; 
    length?: number; 
    weight?: number; 
    vendorId?: object;
    active?: boolean; 
    approvedByAdmin?: boolean;
}
    
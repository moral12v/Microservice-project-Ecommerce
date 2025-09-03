export interface CreateProductVarientDTO {
    id: string;
    categoryId: string;
    productId: string;
    combinationName: string;
    stock : number;
    price: number;
}
    
export interface UpdateProductVarientDTO {
    id?: string;
    categoryId?: string;
    productId?: string;
    combinationName?: string;
    stock? : number;
    price?: number;
}
   
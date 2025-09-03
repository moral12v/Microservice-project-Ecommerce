
export interface CreateProductAddonDTO {
    productId: string;
    categoryId: string;
    addonId: string;
}
  
  export interface UpdateProductAddonDTO {
    productId?: string;
    categoryId?: string;
    addonId?: string;
    deletedAt?: Date;
}
  
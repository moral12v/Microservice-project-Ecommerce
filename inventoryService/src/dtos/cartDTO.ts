export interface AddOnDTO {
  choiceId: string;
  groupId: string;
  name: string;
  price: number;
}

export interface AddToCartDTO {
  productId: string;
  quantity: number;
  addons?: AddOnDTO[]; 
  variantId?: string;  
}

export interface UpdateCartItemDTO {
  productId: string;
  quantity: number;
  addons?: AddOnDTO[]; 
  variantId?: string;  
}

export interface RemoveFromCartDTO {
  productId: string;
}

export interface CreateSubCategoryDTO {
  name: string;
  categoryId: string;
  imageUrl: string;
  isActive: boolean;
  description: string;
  imageUrlLarge?: string;
}

export interface UpdateSubCategoryDTO {
  name?: string;
  imageUrl?: string;
  categoryId?: string;
  isActive?: boolean;
  description?: string;
  imageUrlLarge?: string;
}

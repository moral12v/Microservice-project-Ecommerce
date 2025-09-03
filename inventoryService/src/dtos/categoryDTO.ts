export interface CreateCategoryDTO {
    name: string;
    isActive: boolean;
    imageUrl: string;
    activeIcon?: string;
    disabledIcon?: string;
    imageUrlLarge?: string;
  }
  
  export interface UpdateCategoryDTO {
    name?: string;
    isActive?: boolean;
    imageUrl?: string;
    activeIcon?: string;
    disabledIcon?: string;
    imageUrlLarge?: string;
  }
  
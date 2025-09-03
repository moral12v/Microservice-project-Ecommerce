export interface CreateCustomerDTO {
  fullName: string;
  mobile: string;
  email: string;
}

export interface UpdateCustomerDTO {
  userName?: string;
  fullName?: string;
  mobile?: string;
  email?: string;
  language?: string;
  verified?: boolean;
  isActive: boolean;
  isdeleted: boolean;
}

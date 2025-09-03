export interface CreateAddressDTO {
  customerId?: string;
  addType?: string;
  add1?: string;
  add2?: string;
  city?: string;
  state?: string;
  country?: string;
  area?: string;
  landmark?: string;
  fullName?: string;
  mobile?: string;
  lat?: number;
  lng?: number;
  zipCode?: string;
}

export interface UpdateAddressDTO {
  customerId?: string;
  addType?: string;
  add1?: string;
  add2?: string;
  city?: string;
  state?: string;
  country?: string;
  area?: string;
  landMark?: string;
  fullName?: string;
  mobile?: string;
  lat?: number;
  lng?: number;
  zipCode?: string;
}

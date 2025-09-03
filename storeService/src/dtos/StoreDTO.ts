import { Types } from "mongoose";

export interface CreateStoreDTO {
  aggregatorId: Types.ObjectId;
  mobileNumber: any;
  name: string;
  gstno: string;
  fssaiNumber: string;
  mobile: string;
  email: string;
  vendorId: string;
  isActive: boolean;
  MarketPalceType: string;
  producttype: [];
  servicetype: [];
  deliveryTypes: [];
  gstfileUrl: string;
  FssaifileUrl: string;
  isNegotitation: boolean;
  city: string;
  state: string;
  country: string;
  pincode: string;
  landmark?: string;
  lat: number;
  lng: number;
  area: string;
  streetNumber: number;
  serviceRadius:number
  mallId: string;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  approved: any;
  imgUrl: string;
  password: string;
  storeId?:string;
}

export interface UpdateStoreDTO {
  aggregatorId: string;
  mobileNumber?: any;
  name?: string;
  gstno?: string;
  fssainumber?: string;
  mobile?: string;
  email?: string;
  vendorId?: string;
  isActive?: Boolean;
  mallId: string;
  MarketPalceType?: string;
  producttype?: [];
  servicetype?: [];
  deliveryTypes?: [];
  serviceRadius:number
  gstfileUrl?: string;
  FssaifileUrl?: string;
  isNegotitation?: boolean;
  approved: any;
  imgUrl: string;
  storeId?:string;
}

export interface getNearByStoreDTO {
  lat?: number;
  lng?: number;
  name?:string,
  category?:string
  subCategory?:string;
  filters?: { [key: string]: string[] };
  sort?: string[];
}


export interface updatedetailsDTO{
  freeDelivery: boolean,
  freeDeliveryIfMore: number,
  exchange: boolean,
  policies: string,
  packingCharges: number;
  isNegotitation: boolean;
  serviceRadius: number;
}
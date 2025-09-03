export interface CreateAddonDTO {
    name: string;
    price: number;
    gst: string;
    camparePrice: number;
    available: boolean;
    vendorId: string;
    approve: boolean;
}

export interface UpdateAddonDTO {
    name?: string;
    price?: number;
    gst?: string;
    camparePrice?: number;
    available?: boolean;
    vendorId?: string;
    approve?: boolean;
}
  
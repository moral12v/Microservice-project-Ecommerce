export interface CreateMallDTO {
  mallName: string;
  lat: number;
  lng: number;
  mallAddress: string;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  mallImageUrl: string;
  description:string;
}

export interface UpdateMallDTO {
  mallName: string;
  mallAddress: string;
  lat: number;
  lng: number;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  mallImageUrl: string;
  description:string;
}

export interface getNearByMallDTO {
  lat?: number;
  lng?: number;
}

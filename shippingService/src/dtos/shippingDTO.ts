export interface GetTokenDTO {
  clientId: string;
  clientSecret: string;
}

export class DunzoQuoteDTO {
  clientId: string;
  token: string;
  pickupDetails: {
    lat: number;
    lng: number;
  };
  dropDetails: {
    lat: number;
    lng: number;
  };

  constructor(data: any) {
    this.clientId = data.clientId;
    this.token = data.token;
    this.pickupDetails = {
      lat: data.pickupDetails.lat,
      lng: data.pickupDetails.lng,
    };
    this.dropDetails = {
      lat: data.dropDetails.lat,
      lng: data.dropDetails.lng,
    };
  }
}

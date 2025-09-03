export interface CreateBannerDTO {
  id: object;
  webBannerUrl: string;
  appBannerUrl: string;
  socialLink: string;
  vendorId: object;
  storeId: object;
  active: boolean;
  approve: boolean;
  showInApp: boolean;
  isTodayOffer: boolean;
}

export interface UpdateBannerDTO {
  id: object;
  webBannerUrl: string;
  appBannerUrl: string;
  socialLink: string;
  vendorId: object;
  storeId: object;
  active: boolean;
  approve: boolean;
  showInApp: boolean;
  isTodayOffer: boolean;
}

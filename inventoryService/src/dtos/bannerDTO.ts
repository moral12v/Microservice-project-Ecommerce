export interface createBannerDTO{
  id: object;
  webBannerUrl: string;
  appBannerUrl: string;
  categoryId: string;
  active: boolean;
  showInApp: boolean;
}

export interface updateBannerDTO{
  id: object;
  webBannerUrl: string;
  appBannerUrl: string;
  categoryId: string;
  active: boolean;
  showInApp: boolean;
}
import mongoose, { Document, Schema } from 'mongoose';

export interface BannerDoc extends Document {
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

const BannerSchema: Schema<BannerDoc> = new Schema(
  {
    id: {
      type: Object,
    },
    webBannerUrl: {
      type: String,
      required: true,
    },
    appBannerUrl: {
      type: String,
      required: true,
    },
    socialLink: {
      type: String,
      required: true,
    },
    vendorId: {
      type: Object,
      required: true,
    },
    storeId: {
      type: Object,
    },
    active: {
      type: Boolean,
      required: true,
    },
    approve: {
      type: Boolean,
    },
    showInApp: {
      type: Boolean,
    },
    isTodayOffer: {
      type: Boolean,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export default mongoose.model<BannerDoc>('Banner', BannerSchema);

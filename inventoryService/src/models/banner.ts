import mongoose, { Document, Schema } from "mongoose";

export interface BannerDoc extends Document {
  id: object;
  webBannerUrl: string;
  appBannerUrl: string;
  categoryId: string;
  active: boolean;
  showInApp: boolean;
}

const BannerSchema: Schema<BannerDoc> = new Schema(
  {
    id: { type: Object },
    webBannerUrl: { type: String },
    appBannerUrl: { type: String },
    categoryId: { type: String },
    active: { type: Boolean },
    showInApp: { type: Boolean },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model<BannerDoc>("Banner", BannerSchema);

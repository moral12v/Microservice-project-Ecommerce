import mongoose, { Document, Schema, Types } from "mongoose";

export interface AddonMetaDataDoc extends Document {
  groupName: string;
  minSelection: number;
  maxSelection: number;
  addon: Types.ObjectId[];
  merchantId:string;
 
}

const AddonMetaDataSchema: Schema<AddonMetaDataDoc> = new Schema(
  {
    groupName: { type: String },
    minSelection: { type: Number },
    maxSelection: { type: Number },
    addon:[Types.ObjectId],
    merchantId:{type:String}
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model<AddonMetaDataDoc>("AddonMetaData", AddonMetaDataSchema);

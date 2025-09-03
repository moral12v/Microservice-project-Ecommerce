import mongoose, { Document, Schema } from 'mongoose';

export interface StoreDeliveryTypeDoc extends Document {
  vendorid: string; 
  storeid: string; 
  branchid: string; 
  deliverytypeid: string; 
 
}

const StoreDeliveryTypeSchema: Schema<StoreDeliveryTypeDoc> = new Schema(
  {
    vendorid: { type: String, required: true },
    storeid: { type: String  },
    branchid: { type: String  },
    deliverytypeid: { type: String  },
    
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model<StoreDeliveryTypeDoc>('StoreDeliveryType', StoreDeliveryTypeSchema);

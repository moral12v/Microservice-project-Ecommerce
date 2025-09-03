import mongoose, { Document, Schema } from 'mongoose';


export interface StoreBranchDoc extends Document {
  branchname: string;
  gstnumber: string; 
  fssainumber?: string; 
  mobile: string;
  altmobile?: string; 
  password: string;
  email: string;
  add1: string;
  add2?: string; 
  area: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  landmark?: string; 
  lat?: number;
  lng?: number;
  vendorid:string;
  storeid:string; 
  serviceradius: number;
  imageurl?: string;
  isopen: boolean;
  freedelivery: boolean;
  negotiation: boolean;
  freedeliveryifmore?: number; 
  packingcharges: number;
  exchange: boolean;
  policies?: string; 
  verified: boolean;
  accesstoken?: string;
  refreshtoken?: string;
  devicetoken?: string;
  approved?: boolean; 
  
}

const StoreBranchSchema: Schema<StoreBranchDoc> = new Schema(
  {
    branchname: { type: String, required: true },
    gstnumber: { type: String, required: true, unique: true }, 
    fssainumber: { type: String },
    mobile: { type: String, required: true },
    altmobile: { type: String },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    add1: { type: String, required: true },
    add2: { type: String },
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: { type: String },
    lat: { type: Number },
    lng: { type: Number },
    vendorid: { type: String,  },
    storeid: { type: String,  },
    serviceradius: { type: Number, required: true },
    imageurl: { type: String },
    isopen: { type: Boolean,  },
    freedelivery: { type: Boolean,  },
    negotiation: { type: Boolean,  },
    freedeliveryifmore: { type: Number },
    packingcharges: { type: Number, },
    exchange: { type: Boolean, },
    policies: { type: String },
    verified: { type: Boolean },
    accesstoken: { type: String },
    refreshtoken: { type: String },
    devicetoken: { type: String },
    approved: { type: Boolean , required: true  },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model<StoreBranchDoc>('StoreBranch', StoreBranchSchema);
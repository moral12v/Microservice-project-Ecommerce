import { Schema, model, Document, Types } from "mongoose";

interface AddOn {
  choiceId: Schema.Types.ObjectId;
  groupId: Schema.Types.ObjectId;
}

interface CartItem {
  productId: Schema.Types.ObjectId;
  variantId: Schema.Types.ObjectId;
  quantity: number;
  addons: AddOn[];
}

export interface CartDoc extends Document {
  customerId: Schema.Types.ObjectId;
  merchantId: string;
  items: CartItem[];
  deliveryType: string;
  createdAt: Date;
  updatedAt: Date;
}

const addOnSchema = new Schema<AddOn>({
  choiceId: {
    type: Schema.Types.ObjectId,
    ref: "MerchantProduct",
    required: true,
  },
  groupId: {
    type: Schema.Types.ObjectId,
    ref: "AddonMetaData",
    required: true,
  },
});

const cartItemSchema = new Schema<CartItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "MerchantProduct",
    required: true,
  },
  variantId: {
    type: Schema.Types.ObjectId,
    ref: "MerchantProduct.variants"
  },
  quantity: { type: Number, required: true, min: 1 },
  addons: [addOnSchema],
});

const cartSchema = new Schema<CartDoc>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      index: true,
      required: true,
    },
    merchantId: {
      type: String,
      index: true,
      required: true,
    },
    items: [cartItemSchema],
    deliveryType: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Cart = model<CartDoc>("Cart", cartSchema);

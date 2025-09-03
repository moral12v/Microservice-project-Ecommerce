import mongoose, { Document, Schema } from 'mongoose';

export interface SubscriptionDoc extends Document {
 id: string;
 subscriptionId: string;
 amountPaid: number;
 planPrice: number;
 gstAmount: number;
 paymentRefId: string;
 userId: string;
 subscriptionStartDate: string;
 subscriptionEndDate: string;
 planId: string;
 
}

const SubscriptionSchema: Schema<SubscriptionDoc> = new Schema(
  {
    id: { type: String, required: true },
    subscriptionId: { type: String  },
    amountPaid: { type: Number  },
    planPrice: { type: Number  },
    gstAmount: { type: Number  },
    paymentRefId: { type: String  },
    userId: { type: String  },
    subscriptionStartDate: { type: String  },
    subscriptionEndDate: { type: String  },
    planId: { type: String  },

    
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model<SubscriptionDoc>('Subscription', SubscriptionSchema);

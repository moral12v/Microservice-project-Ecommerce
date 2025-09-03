import mongoose, { Document, Schema, Types } from 'mongoose';

export interface NotificationDoc extends Document {
    customerId: object;
    title: string;
    body: string;
    image: string;
    url: string;
    isRead: boolean;

    
}

const NotificationSchema: Schema<NotificationDoc> = new Schema(
    {
        customerId  : { type: Schema.Types.ObjectId, index: true },
        title       : { type: String, index: true, default:null },
        body        : { type: String, index: true, default:null  },
        image       : { type: String, index: true, default:null  },
        url         : { type: String, index: true, default:null  },
        isRead      : { type: Boolean, index: true , default:false}
      },
      { timestamps: true } 
);

export default mongoose.model<NotificationDoc>('Notification', NotificationSchema);

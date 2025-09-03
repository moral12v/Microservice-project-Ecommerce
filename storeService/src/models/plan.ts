import mongoose, { Document, Schema } from 'mongoose';

export interface PlanDoc extends Document {
    planName: string;
    benefits: [string];
    price: number;
    gst: number;
    durationInDays: number;
    color: string;
    planFor: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

const PlanSchema: Schema<PlanDoc> = new Schema(
    {
        planName: { type: String, required: false },
        benefits: { type: [String], required: false },
        price: { type: Number, required: false },
        gst: { type: Number, required: false, default: 0 },
        durationInDays: { type: Number, required: false, default: 28 },
        color: { type: String, required: false },
        planFor: { type: String, required: false },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        deletedAt: { type: Date, required: false },
    },
    {
        versionKey: false,
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    }
);

export default mongoose.model<PlanDoc>('Plan', PlanSchema);

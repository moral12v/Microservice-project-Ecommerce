import mongoose, { Document, Schema } from 'mongoose';

export interface CombinationdetailsDoc extends Document {
    id: string;
    combinationId: string;
    attributeId: string;
    attributeValue: string;

 }

const CombinationdetailsSchema: Schema<CombinationdetailsDoc> = new Schema(
    {
        id: {type: String},
        combinationId: { type: String, },
        attributeId:{type: String},
        attributeValue:{type: String}
        
      },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model<CombinationdetailsDoc>('Combinationdetails', CombinationdetailsSchema);

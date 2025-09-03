import mongoose, { Document, Schema } from 'mongoose';

export interface SortConfig extends Document {
  _id:string;
  key: string;
  title: string;
  selected?: boolean;
  defaultSelection?: boolean;
}

interface FilterOption extends Document {
  value: string;
  label: string;
}

export interface FilterConfig extends Document {
  _id:string;
  key: string;
  title: string;
  options: FilterOption[];
  selectType: string; 
}

export interface ConfigDocument extends Document {
    _id:string;
  modelKey: string;
  sortConfigs: SortConfig[];
  filterConfigs: FilterConfig[];
}

const sortConfigSchema: Schema<SortConfig> = new Schema({
  key: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  selected: { type: Boolean, default: false },
  defaultSelection: { type: Boolean, default: false },
});

const filterOptionSchema: Schema<FilterOption> = new Schema({
  value: { type: String, required: true },
  label: { type: String, required: true },
});

const filterConfigSchema: Schema<FilterConfig> = new Schema({
  key: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  options: [filterOptionSchema],
  selectType: { type: String, required: true } 
});

const configSchema: Schema<ConfigDocument> = new Schema({
  modelKey: { type: String, required: true },
  sortConfigs: [sortConfigSchema],
  filterConfigs: [filterConfigSchema],
});

const Config = mongoose.model<ConfigDocument>('Config', configSchema);

export default Config;

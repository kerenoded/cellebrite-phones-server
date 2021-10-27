import { Colors } from './colors';
import { Document, Model, model, Schema } from "mongoose";

export interface PhoneContext {
  color?: Colors;
  type: String;
  serial: String;
  metaData: String;
}

interface IPhone extends PhoneContext, Document{
}

const phoneSchema: Schema = new Schema({
  color: {
    type: String,
    enum : Colors,
    required: false,
    index: true
  },
  type: {
    type: String,
    required: true,
    index: true
  },
  serial: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  metaData: {
    type: String,
    required: true,
    index: true
  }
});
//phoneSchema.index({type: 'text', serial: 'text', metaData: 'text'});

const Phone: Model<IPhone> = model("Phone", phoneSchema);

export default Phone;
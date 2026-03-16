import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  price: { type: Number, required: true, min: 0 },
  status: { type: Boolean, default: true },
  stock: { type: Number, required: true, min: 0 },
  category: { type: String, default: '' },
  thumbnails: { type: [String], default: [] }
}, {
  timestamps: true,
  toJSON: { virtuals: true, transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }},
  toObject: { virtuals: true, transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }}
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;

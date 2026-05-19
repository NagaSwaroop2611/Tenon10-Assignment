import mongoose from "mongoose";

const productSchema =  mongoose.Schema(
  {
    name:{
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description of Product is required"],
      maxlength: [500, "Decscription cannot exceed 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],  
      trim: true,
      lowercase: true,
      index: true,
      set: (v) => v.toLowerCase().trim()
    },
    imageUrl: {
      type: String,
      default: "",
    },
    imagePublicId: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type:    Boolean,
      default: false,
    },
  },
  { timestamps: true},
);

// Full text search index on name + description
productSchema.index({
  name: "text",
  description: "text"
});

productSchema.pre("save", function () {
  if (this.stock === 0) {
    this.isAvailable = false;
    this.isFeatured = false;
  } else {
    this.isAvailable = true;
  }
});

const Product = mongoose.model("Product", productSchema);
export default Product;
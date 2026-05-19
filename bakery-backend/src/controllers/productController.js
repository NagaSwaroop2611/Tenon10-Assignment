import Product from "../models/Product.js";
import { cloudinary } from "../config/cloudinary.js";

// --- Get All Products ---
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { category, search, feature, page = 1, limit = 12} = req.query;

    const query = {isAvailable: true};

    if(category) query.category = category;

    if(feature === "true") query.isFeatured = true;

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i"
          }
        },
        {
          description: {
            $regex: search,
            $options: "i"
          }
        },
        {
          category: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }
    

    const skip = (Number(page) - 1) * Number(limit);

    const [ products, total ] = await Promise.all([
      Product
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      success:    true,
      count:      products.length,
      total,
      page:       Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      products,
    });

  } catch (error) {
    next(error);
  }
};

// --- Get Single Product ---
// @access  Public
const getProduct = async (req,res,next) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if(!product){
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error)
  }
};

// --- Create Product --- 
// @access  Admin
const createProduct = async (req,res,next) => {
  try {
    const { name, description, price, category, stock, isFeatured } = req.body;

    // Manual validation 
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, description, price and category are required",
      });
    }
 
    if (isNaN(price) || Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid positive number",
      });
    }
 
    

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock) || 0,
      isFeatured: isFeatured === "true" || isFeatured === true,
      imageUrl: req.file?.path || "",
      imagePublicId: req.file?.filename || "",
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });
  } catch (error) {
    next(error);
  }
};

// --- Update Product ---
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const { price, stock, isFeatured, isAvailable, ...rest } = req.body;

    // ── Assign basic fields ─────────────────────
    Object.assign(product, rest);

    // ── PRICE validation ────────────────────────
    if (price !== undefined) {
      if (isNaN(price) || Number(price) < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be valid positive number",
        });
      }
      product.price = Number(price);
    }

    // ── STOCK handling ──────────────────────────
    if (stock !== undefined) {
      const newStock = Number(stock);

      if (newStock < 0) {
        return res.status(400).json({
          success: false,
          message: "Stock cannot be negative",
        });
      }

      product.stock = newStock;
    }

    // ── IMAGE upload ────────────────────────────
    if (req.file) {
      if (product.imagePublicId) {
        await cloudinary.uploader.destroy(product.imagePublicId);
      }

      product.imageUrl = req.file.path;
      product.imagePublicId = req.file.filename;
    }

    // ── OPTIONAL manual overrides (if sent) ─────
    if (isFeatured !== undefined) {
      product.isFeatured =
        isFeatured === "true" || isFeatured === true;
    }

    if (isAvailable !== undefined) {
      product.isAvailable =
        isAvailable === "true" || isAvailable === true;
    }

    // 🔥 THIS IS WHERE YOUR MIDDLEWARE WILL RUN
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });

  } catch (error) {
    next(error);
  }
};

// --- Delete Product --- 
// @access  Admin
const deleteProduct = async (req,res,next) => {
  try {
    const prodId = req.params.id;
    const product = await Product.findById(prodId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }
 
    if (product.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(product.imagePublicId);
      } catch (cloudinaryError) {
        console.log("Cloudinary delete failed:", cloudinaryError.message);
      }
    }
 
    await product.deleteOne();
    res.status(200).json({ 
      success: true, 
      message: "Product deleted successfully" 
    });
  } catch (error) {
    next(error);
  }
};

// --- Get All Products (Admin — includes unavailable) ---
// @access Admin
const getAdminProducts = async (req, res, next) => {
  try {
    const {
      category,
      stockSort,
      availability
    } = req.query

    const query = {}

    // category filter
    if (category) query.category = category

    // availability filter
    if (availability === "available") query.isAvailable = true
    if (availability === "unavailable") query.isAvailable = false

    let sort = { createdAt: -1 }

    // stock sorting
    if (stockSort === "asc") sort = { stock: 1 }
    if (stockSort === "desc") sort = { stock: -1 }

    const products = await Product.find(query).sort(sort)

    res.json({
      success: true,
      products
    })
  } catch (err) {
    next(err)
  }
}

// --- Get All Categories ---
const getCategories = async (req, res) => {
  try {
    let categories = await Product.distinct("category");

    categories = categories
      .filter(Boolean)
      .map(c => c.toLowerCase().trim())
      .filter((v, i, self) => self.indexOf(v) === i); // remove duplicates
    console.log(categories);
    
    return res.status(200).json({
      success: true,
      categories,
    });

  } catch (error) {
    console.log("CATEGORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getProducts, getProduct, getAdminProducts, createProduct, updateProduct, deleteProduct, getCategories };
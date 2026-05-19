import Order from "../models/Order.js";
import Product from "../models/Product.js";

// --- Place Order ---
// @access  Private (customer)
const placeOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress, notes } = req.body;
    if(!items || items.length === 0){
      return res.status(400).json({
        success: false,
        message: "No items in order"
      });
    }

    // Manual Validation
    const { name, email, phone, street, city, state, pincode } = deliveryAddress || {};
    if (!name || !email || !phone || !street || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: "All delivery address fields are required",
      });
    }
    // Validate each product from DB — never trust client-side prices
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `Product "${item.name || item.product}" is unavailable`,
        });
      }
      const lineTotal = product.price * item.quantity;
      totalAmount += lineTotal;
 
      orderItems.push({
        product:  product._id,
        name:     product.name,
        price:    product.price,   // snapshot — DB price not client price
        imageUrl: product.imageUrl,
        quantity: item.quantity,
      });
    }
 
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      deliveryAddress,
      totalAmount,
      notes: notes || "",
    });

    res.status(201).json({
      success: true,
      message: "Order Placed Successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// --- Get My Orders
// @access  Private (customer)

const getMyOrders = async (req,res,next) => {
  try {
    const orders = await Order
      .find({user: req.user._id})
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error)
  }
};

// --- Get Single Order ---
// @access  Private 

const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
 
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }
 
    // Customer can only see their own orders; admin can see all
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorised to view this order" });
    }
 
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// --- Get All Orders ---
// @access Admin
const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const validStatuses = ["pending", "confirmed", "baking", "out_for_delivery", "delivered", "cancelled"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status filter" });
    }
 
    const query = status ? { status } : {};
    const skip  = (Number(page) - 1) * Number(limit);
 
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("user", "name email phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(query),
    ]);
 
    res.status(200).json({
      success:    true,
      count:      orders.length,
      total,
      page:       Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// --- Update Order Status ---
// @access Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ 
        success: false, 
        message: "Status is required" 
      });
    }
 
    const validStatuses = ["pending", "confirmed", "baking", "out_for_delivery", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid status value" 
      });
    }
 
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after", runValidators: true }
    );
 
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
 
    res.status(200).json({
      success: true,
      message: `Order status updated to "${status}"`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// --- Cancel Order ---
// @access  Private (owner/customer who has ordered only)
const cancelOrder = async (req,res,next) => {
  try {
    const orderId = req.params.id
    const order = await Order.findById(orderId);

    if(!order){
      return res.status(404).json({
        success: false,
        message: "Order Not Found",
      });
    }

    if(order.user.toString() !== req.user._id.toString()){
      return res.status(403).json({ 
        success: false, 
        message: "Not authorised to cancel this order" 
      });
    }

    if (["delivered", "cancelled"].includes(order.status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot cancel an order that is "${order.status}"` 
      });
    }

    order.status = "cancelled";
    await order.save();
 
    res.status(200).json({ 
      success: true, 
      message: "Order cancelled successfully", 
      order 
    });

  } catch (error) {
    next(error);
  }
}

export {getAllOrders, getMyOrders, getOrder,placeOrder, updateOrderStatus, cancelOrder};
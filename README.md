# 🥐 Crumbs & Co — Artisanal Bakery

A full-stack online bakery web application built with **React**, **Redux Toolkit**, **Node.js**, **Express**, and **MongoDB**.

---

## 📁 Project Structure

```
Tenon10-assignment/
├── Backend/                        # Express + MongoDB API
│   ├── src/
│   │   ├── config/
│   │   │   ├── cloudinary.js       # Cloudinary + Multer setup
│   │   │   └── db.js               # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js   # Register, login, profile, password
│   │   │   ├── productController.js# CRUD products + Cloudinary
│   │   │   └── orderController.js  # Place, track, cancel, admin orders
│   │   ├── middleware/
│   │   │   ├── auth.js             # protect + adminOnly guards
│   │   │   └── errorHandler.js     # Global error handler
│   │   ├── models/
│   │   │   ├── User.js             # User schema (bcrypt, profilePic)
│   │   │   ├── Product.js          # Product schema (Cloudinary image)
│   │   │   └── Order.js            # Order schema (items snapshot)
│   │   ├── routes/
│   │   │   ├── userRoutes.js       # /api/v1/bakery/user/*
│   │   │   ├── productRoutes.js    # /api/v1/bakery/product/*
│   │   │   └── orderRoutes.js      # /api/v1/bakery/order/*
│   │   └── utils/
│   │   |   └── generateToken.js    # JWT generator
│   |   ├── index.js                    # Express app entry point
|   |   |__ seedAdmin.js
│   ├── .env                        # Environment variables
│   └── package.json
│
└── bakery-frontend/                # React + Vite frontend
    ├── public/
    ├── src/
    │   ├── api/
    │   │   └── axios.js            # Axios instance + interceptors
    │   ├── app/
    │   │   └── store.js            # Redux store
    │   ├── components/
    │   │   ├── common.jsx # Button, Input, Spinner, Badge, Modal, ProductCard
    │   │   ├── layout/
    │   │   │   ├── Navbar.jsx      # Sticky navbar with cart count + user menu
    │   │   │   └── Footer.jsx      # Footer with links
    |   |   |   └── Guards.jsx      # ProtectedRoute, AdminRoute, GuestRoute
    |   |   |   └── Layout.jsx      # RootLayout for guest and customers
    │   │   └── admin/
    │   │       └── AdminLayout.jsx # Admin sidebar layout
    │   ├── features/
    │   │   ├── auth/
    │   │   │   └── authSlice.js    # register, login, logout, getMe, updateProfile
    │   │   ├── products/
    │   │   │   └── productSlice.js # fetchProducts, CRUD (admin)
    │   │   ├── cart/
    │   │   │   └── cartSlice.js    # addToCart, remove, qty — persisted in localStorage
    │   │   └── orders/
    │   │       └── orderSlice.js   # placeOrder, myOrders, admin all orders
    │   ├── pages/
    │   │   ├── Home.jsx            # Landing page — hero, featured, categories
    │   │   ├── Login.jsx           # Login form
    │   │   ├── Register.jsx        # Register form
    │   │   ├── Products.jsx        # Product listing with filters + pagination
    │   │   ├── ProductDetail.jsx   # Single product + related items
    │   │   ├── CartCheckout.jsx    # Cart page + Checkout form
    │   │   ├── Orders.jsx          # Order confirmation + My Orders
    │   │   ├── Profile.jsx         # Update profile + change password
    │   │   └── admin/
    │   │       ├── Dashboard.jsx   # Admin overview + recent orders
    │   │       ├── Orders.jsx      # Admin order management + status update
    │   │       ├── Products.jsx    # Admin product CRUD with modal
    │   │       └── Customers.jsx   # Admin user list + delete
    |   |       └── Profile.jsx     # Admin Profile
    │   │       ├── OrdersDetails.jsx      # Single Order + related items
    │   ├── App.jsx                 # All routes
    │   ├── main.jsx                # React root + Redux provider
    │   └── index.css               # Tailwind base styles
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env.example
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

---

### 1. Clone the repo

```bash
git clone https://github.com/NagaSwaroop2611/Tenon10-Assignment.git
cd Tenon10-Assignment
```

---

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:

```env
PORT=5001
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/bakery
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
# or
node src/index.js
```

Backend runs on **http://localhost:5001**

---

### 3. Frontend Setup

```bash
cd bakery-frontend
npm install
```

Create a `.env` file in `bakery-frontend/`:

```env
VITE_API_URL=http://localhost:5001/api/v1/bakery
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on **http://localhost:5173**

---

## 🔑 Creating an Admin

Run the seed script to create an admin user:

node Backend/src/seedAdmin.js

This will automatically create an admin account.
No need to manually change roles in MongoDB.
Login with the seeded credentials to access the admin panel.

---

## 🌐 API Routes

### Auth — `/api/v1/bakery/user`

| Method | Route              | Access  | Description          |
|--------|--------------------|---------|----------------------|
| POST   | /register          | Public  | Create account       |
| POST   | /login             | Public  | Login + get token    |
| POST   | /logout            | Private | Logout               |
| GET    | /me                | Private | Get my profile       |
| PUT    | /update-profile    | Private | Update profile + pic |
| PUT    | /change-password   | Private | Change password      |
| GET    | /all               | Admin   | All users            |
| DELETE | /:id               | Admin   | Delete user          |

### Products — `/api/v1/bakery/product`

| Method | Route        | Access | Description                    |
|--------|--------------|--------|--------------------------------|
| GET    | /all         | Public | List products (filter/search)  |
| GET    | /:id         | Public | Single product                 |
| GET    | /admin/all   | Admin  | All products incl. unavailable |
| POST   | /create      | Admin  | Create product + image upload  |
| PUT    | /:id         | Admin  | Update product                 |
| DELETE | /:id         | Admin  | Delete product + Cloudinary    |
| GET    | /categories  | Public | Distinct Category              |

### Orders — `/api/v1/bakery/order`

| Method | Route           | Access   | Description           |
|--------|-----------------|----------|-----------------------|
| POST   | /place          | Private  | Place order           |
| GET    | /my-orders      | Private  | My orders             |
| GET    | /:id            | Private  | Single order          |
| PATCH  | /:id/cancel     | Private  | Cancel order          |
| GET    | /admin/all      | Admin    | All orders paginated  |
| PATCH  | /:id/status     | Admin    | Update order status   |

---

## 🛠 Tech Stack

### Backend
| Tool        | Purpose                  |
|-------------|--------------------------|
| Node.js     | Runtime                  |
| Express.js  | Web framework            |
| MongoDB     | Database                 |
| Mongoose    | ODM                      |
| JWT         | Authentication           |
| bcryptjs    | Password hashing         |
| Cloudinary  | Image storage            |
| Multer      | File upload middleware    |
| dotenv      | Environment variables    |
| validator   | validating emails        |

### Frontend
| Tool              | Purpose                     |
|-------------------|-----------------------------|
| React 18          | UI library                  |
| Redux Toolkit     | State management            |
| React Router v6   | Client-side routing         |
| Axios             | HTTP client + interceptors  |
| Tailwind CSS      | Utility-first styling       |
| react-hot-toast   | Toast notifications         |
| react-icons       | Icon library                |
| Vite              | Build tool                  |

---

## ✨ Features

### Customer
- Browse products with category filters, search, pagination
- Product detail page with quantity selector
- Cart persisted in `localStorage`
- Checkout with delivery address
- View and cancel orders
- Update profile, shipping address, profile picture
- Change password

### Admin
- Dashboard with stats — total orders, revenue, out of stock
- Order management — update status via dropdown
- Product CRUD — create/edit/delete with image upload
- Customer list — view and delete users

---

## 🐛 Known Issues / TODOs

- [ ] Payment gateway integration (Razorpay / Stripe)
- [ ] Email notifications on order status change
- [ ] Google OAuth login
- [ ] Forgot password flow

---

> Built with ☕ and 🥐 by Swaroop

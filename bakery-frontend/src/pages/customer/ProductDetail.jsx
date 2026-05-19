import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProduct, fetchProducts } from '../../features/products/productSlice'
import { addToCart } from '../../features/cart/cartSlice'
import { Spinner, ProductCard } from '../../components/common'
import { FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { selected: product, items: related, loading } = useSelector(s => s.products)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    dispatch(fetchProduct(id))
    dispatch(fetchProducts({ limit: 4 }))
    window.scrollTo(0, 0)
  }, [id, dispatch])

  const handleAdd = () => {
    dispatch(addToCart({ ...product, quantity: qty }))
    toast.success(`${product.name} added to cart!`)
  }

  if (loading || !product) return <Spinner />

  return (
    <div className="min-h-screen">
      {/* <Navbar /> */}

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-brown/40 mb-8">
          <Link to="/" className="hover:text-brown">Home</Link> ›
          <Link to="/products" className="hover:text-brown">Bakery Products</Link> ›
          <span className="text-brown">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* Image */}
          <div className="aspect-square rounded-3xl overflow-hidden bg-cream-dark">
            {product.imageUrl
              ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-8xl">🥐</div>
            }
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-sage/20 text-sage text-xs">Vegan</span>
              <span className="px-3 py-1 rounded-full bg-sage/20 text-sage text-xs capitalize">{product.category}</span>
            </div>

            <h1 className="font-serif text-4xl text-brown mb-2">{product.name}</h1>
            <p className="font-mono text-2xl text-gold mb-6">₹{product.price}</p>
            <p className="text-brown/60 text-sm leading-relaxed mb-8">{product.description}</p>

            {product.isAvailable ? (
              <div className="flex items-center gap-4">
                {/* Qty */}
                <div className="flex items-center gap-3 border border-brown/20 rounded-full px-3 py-2">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-brown/60 hover:text-brown transition-colors">
                    <FiMinus size={16} />
                  </button>
                  <span className="font-mono text-brown w-6 text-center">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="text-brown/60 hover:text-brown transition-colors">
                    <FiPlus size={16} />
                  </button>
                </div>
                <button onClick={handleAdd} className="flex-1 flex items-center justify-center gap-2 bg-brown text-cream py-3 rounded-full hover:bg-brown/90 transition-colors">
                  <FiShoppingBag size={18} /> Add to Cart
                </button>
              </div>
            ) : (
              <button disabled className="bg-brown/20 text-brown/40 py-3 rounded-full text-sm">Unavailable</button>
            )}

            <div className="mt-6 text-xs text-brown/40">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </div>
          </div>
        </div>

        {/* Related */}
        <div>
          <h2 className="font-serif text-2xl text-brown text-center mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.filter(p => p._id !== id).slice(0, 4).map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  )
}
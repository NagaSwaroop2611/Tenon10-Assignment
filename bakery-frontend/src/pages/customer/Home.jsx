import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories, fetchProducts } from '../../features/products/productSlice'
import { ProductCard, Spinner } from '../../components/common'
import {
  FaBreadSlice,
  FaCookie,
  FaIceCream,
  FaBirthdayCake
} from 'react-icons/fa'

const categoryIcons = {
  bread: FaBreadSlice,
  cake: FaBirthdayCake,
  cookie: FaCookie,
  icecream: FaIceCream,
  // add more as needed
}
export default function Home() {
  const { items: products, loading, categories } = useSelector(s => s.products)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchProducts({ limit: 4, feature: 'true' }))
  }, [dispatch])

  return (
    <div className="min-h-screen">
      {/* <Navbar /> */}

      {/* Hero */}
      <section className="relative h-[75vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1400"
          alt="Artisan bread"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brown/70 via-brown/30 to-transparent" />
        <div className="relative z-10 h-full flex items-center px-8 md:px-20">
          <div className="max-w-lg text-cream">
            <p className="text-cream/60 text-sm uppercase tracking-[0.2em] mb-4">Artisanal Flourish</p>
            <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-6">
              in Every<br />Bite
            </h1>
            <p className="text-cream/70 text-sm leading-relaxed mb-8 max-w-xs">
              Handcrafted with stone-ground flour, organic ingredients, and a touch of warmth. Experience the warmth of traditional baking.
            </p>
            <Link to="/products" className="inline-block bg-brown/90 text-cream px-8 py-3 rounded-full font-medium hover:bg-brown transition-colors">
              Order Now
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 max-w-6xl mx-auto px-4">
        <div className="flex justify-center gap-8">
          {(categories ?? []).map(cat => {
            const IconComponent = categoryIcons[cat.toLowerCase()] || FaBreadSlice
            return (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-16 h-16 rounded-full bg-cream-dark border-2 border-brown/10 flex items-center justify-center group-hover:border-brown/40 transition-all">
                  <IconComponent className="text-xl text-brown" />
                </div>
                <span className="text-xs text-brown/70 group-hover:text-brown transition-colors capitalize">
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured products */}
      <section className="py-8 max-w-6xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-serif text-3xl text-brown">Freshly Baked</h2>
            <p className="text-brown/50 text-sm mt-1">Our most beloved artisanal creations.</p>
          </div>
          <Link to="/products" className="text-sm text-gold hover:underline">View All →</Link>
        </div>

        {loading ? <Spinner /> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* Heritage section */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm uppercase tracking-widest text-brown/40 mb-3">Our Heritage</p>
            <h2 className="font-serif text-4xl text-brown mb-6">Rooted in Tradition,<br />Baked for Today.</h2>
            <p className="text-brown/60 text-sm leading-relaxed mb-4">
              At Crumbs & Co we believe that great bread starts long before it enters the oven. We source only the finest stone-ground, organic flours from local mills, honoring the ancient art of slow fermentation.
            </p>
            <p className="text-brown/60 text-sm leading-relaxed mb-6">
              Every pastry is rolled by hand, and every loaf is nurtured over days to develop a depth of flavor that commercial yeast simply cannot replicate. It's not just baking, it's a craft.
            </p>
            <button className="text-sm text-brown underline underline-offset-4">Read Our Full Story</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src="https://images.unsplash.com/photo-1587241321921-91a834d6d191?w=400" alt="" className="rounded-2xl object-cover h-48 w-full" />
            <div className="bg-brown rounded-2xl flex flex-col items-center justify-center p-6 text-cream">
              <span className="font-serif text-4xl font-bold">48</span>
              <span className="text-sm mt-1">Hrs</span>
              <p className="text-xs text-cream/60 mt-2 text-center">Minimum fermentation time for our signature sourdoughs.</p>
            </div>
            <img src="https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400" alt="" className="rounded-2xl object-cover h-48 w-full col-span-2" />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-cream-dark">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="text-3xl mb-4">✉️</div>
          <h2 className="font-serif text-3xl text-brown mb-2">Fresh out of the oven.</h2>
          <p className="text-brown/50 text-sm mb-6">Join our mailing list to receive updates on seasonal specials, secret menu items, and baking workshops.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Your email address" className="flex-1 px-4 py-2.5 rounded-full border border-brown/20 bg-white text-sm outline-none focus:border-brown/50" />
            <button className="bg-brown text-cream px-5 py-2.5 rounded-full text-sm hover:bg-brown/90 transition-colors">Subscribe</button>
          </div>
          <p className="text-xs text-brown/30 mt-3">We respect your privacy. No spam, just crumbs.</p>
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  )
}
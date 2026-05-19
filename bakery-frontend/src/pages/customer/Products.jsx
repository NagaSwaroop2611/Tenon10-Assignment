import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProducts,
  fetchCategories
} from '../../features/products/productSlice'

import {
  ProductCard,
  Spinner,
  EmptyState
} from '../../components/common'

import { FiSearch } from 'react-icons/fi'

export default function Products() {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()

  const { items, totalPages, loading, categories } =
    useSelector(s => s.products)

  // UI states
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [featured, setFeatured] = useState(false)
  const [page, setPage] = useState(1)

  // ✅ fetch categories ONCE
  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  // ✅ fetch products whenever filters change
  useEffect(() => {
    const params = {
      page,
      limit: 12,
    }

    if (search) params.search = search
    if (category) params.category = category
    if (featured) params.feature = "true"

    dispatch(fetchProducts(params))

    // sync URL
    setSearchParams({
      ...(search && { search }),
      ...(category && { category }),
      ...(featured && { featured }),
      page
    })

  }, [dispatch, page, category, search, featured])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
  }

  const handleCategory = (cat) => {
    setCategory(cat === 'all' ? '' : cat)
    setPage(1)
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="font-serif text-4xl text-brown">
            Artisanal Selection
          </h1>

          {/* SEARCH */}
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 border border-brown/20 rounded-full px-4 py-2 bg-white"
          >
            <FiSearch className="text-brown/40" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search bakery..."
              className="outline-none text-sm bg-transparent text-brown w-48"
            />
          </form>
        </div>

        {/* FEATURED TOGGLE */}
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={() => setFeatured(prev => !prev)}
            className={`px-4 py-1.5 rounded-full text-sm border transition
            ${featured
                ? 'bg-gold text-white'
                : 'bg-white text-brown border-brown/20'
              }`}
          >
            Featured Only
          </button>
        </div>

        {/* CATEGORY FILTER (DYNAMIC) */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => handleCategory('all')}
            className={`px-4 py-1.5 rounded-full text-sm
              ${!category ? 'bg-brown text-cream' : 'bg-white border'}
            `}
          >
            All
          </button>

          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm capitalize
              ${category === cat
                  ? 'bg-brown text-cream'
                  : 'bg-white border border-brown/20 text-brown/70'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GRID */}
        {loading ? (
          <Spinner />
        ) : items.length === 0 ? (
          <EmptyState
            icon="🥐"
            title="Nothing here yet"
            description="Try adjusting filters or search."
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {items.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-full border"
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-full text-sm
                ${n === page ? 'bg-brown text-cream' : 'border'}`}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-full border"
            >
              →
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
import { Link } from 'react-router-dom'
import { FiHome, FiArrowLeft } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="text-center max-w-md">

        {/* 404 Illustration */}
        <div className="text-7xl mb-4">🍞</div>

        {/* Title */}
        <h1 className="font-serif text-5xl text-brown mb-2">
          404
        </h1>

        {/* Subtitle */}
        <h2 className="text-xl text-brown/80 mb-3">
          Oops! This page is missing from the oven.
        </h2>

        <p className="text-sm text-brown/60 mb-8">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-brown/20 text-brown hover:bg-brown hover:text-cream transition"
          >
            <FiArrowLeft />
            Go Back
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-brown text-cream hover:bg-brown/90 transition"
          >
            <FiHome />
            Home
          </Link>

        </div>

      </div>
    </div>
  )
}
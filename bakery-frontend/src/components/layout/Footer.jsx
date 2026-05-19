import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-brown text-cream/80 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-serif text-cream text-xl mb-2">Crumbs & Co</h3>
          <p className="text-sm leading-relaxed">Baking memories daily with artisanal ingredients and a lot of love.</p>
          <p className="text-xs mt-4 text-cream/50">© 2024 Crumbs & Co. Artisanal Bakery.</p>
        </div>
        <div>
          <h4 className="text-cream font-medium mb-3 text-sm uppercase tracking-widest">Connect</h4>
          <div className="flex flex-col gap-2 text-sm">
            <a href="#" className="hover:text-cream transition-colors">Facebook</a>
            <a href="#" className="hover:text-cream transition-colors">Instagram</a>
          </div>
        </div>
        <div>
          <h4 className="text-cream font-medium mb-3 text-sm uppercase tracking-widest">Legal</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/terms" className="hover:text-cream transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-cream transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
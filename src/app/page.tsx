'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import DesignCard from '@/components/DesignCard'
import OrderModal from '@/components/OrderModal'
import type { Design } from '@/lib/supabase'

// Demo designs - in production these come from Supabase
const DEMO_DESIGNS: Design[] = [
  {
    id: '1',
    name: 'The Bird',
    description: 'A delicate songbird perched on a flowering branch. Perfect for nature lovers.',
    image_url: 'https://images.unsplash.com/photo-1549608276-5786777e6587?w=400&h=400&fit=crop',
    category: 'Nature',
    available_sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available_textiles: ['T-Shirt', 'Hoodie', 'Tote Bag', 'Cap'],
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Floral Mandala',
    description: 'Intricate mandala pattern with floral elements. A statement piece.',
    image_url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop',
    category: 'Abstract',
    available_sizes: ['S', 'M', 'L', 'XL'],
    available_textiles: ['T-Shirt', 'Sweatshirt', 'Pillow Cover'],
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Mountain Sunset',
    description: 'Layered mountain silhouettes against a gradient sunset sky.',
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop',
    category: 'Landscape',
    available_sizes: ['M', 'L', 'XL', '2XL'],
    available_textiles: ['T-Shirt', 'Hoodie', 'Jacket'],
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Celestial Moon',
    description: 'Mystical crescent moon surrounded by stars and cosmic elements.',
    image_url: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=400&h=400&fit=crop',
    category: 'Celestial',
    available_sizes: ['XS', 'S', 'M', 'L', 'XL'],
    available_textiles: ['T-Shirt', 'Tank Top', 'Beanie'],
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Botanical Garden',
    description: 'Lush botanical illustration featuring exotic leaves and flowers.',
    image_url: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&h=400&fit=crop',
    category: 'Nature',
    available_sizes: ['S', 'M', 'L'],
    available_textiles: ['T-Shirt', 'Tote Bag', 'Apron'],
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Geometric Fox',
    description: 'Modern geometric interpretation of a fox. Bold and contemporary.',
    image_url: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400&h=400&fit=crop',
    category: 'Animals',
    available_sizes: ['S', 'M', 'L', 'XL', '2XL'],
    available_textiles: ['T-Shirt', 'Hoodie', 'Snapback'],
    is_active: true,
    created_at: new Date().toISOString(),
  },
]

const CATEGORIES = ['All', 'Nature', 'Abstract', 'Landscape', 'Celestial', 'Animals']

export default function HomePage() {
  const [designs, setDesigns] = useState<Design[]>(DEMO_DESIGNS)
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [twitchUser, setTwitchUser] = useState<{ display_name: string; email?: string; profile_image_url: string } | null>(null)

  // Check for logged in user
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const user = await response.json()
          setTwitchUser(user)
        }
      } catch {
        // Not logged in
      }
    }
    checkUser()
  }, [])

  // Filter designs by category
  const filteredDesigns = activeCategory === 'All' 
    ? designs 
    : designs.filter(d => d.category === activeCategory)

  const handleSelectDesign = (design: Design) => {
    setSelectedDesign(design)
    setIsModalOpen(true)
  }

  return (
    <main className="min-h-screen">
      <Navigation twitchUser={twitchUser} />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-thread-burgundy/10 text-thread-burgundy rounded-full font-body text-sm mb-6">
              ✨ Handcrafted with love
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
              <span className="text-thread-charcoal">Beautiful</span>
              <br />
              <span className="gradient-text">Embroidery Designs</span>
            </h1>
            <p className="font-body text-xl text-thread-charcoal/70 max-w-2xl mx-auto mb-8">
              Browse our collection of unique embroidery patterns. Select your favorite design, 
              choose your textile, and submit your order.
            </p>
          </motion.div>

          {/* Decorative thread line */}
          <motion.div 
            className="thread-line max-w-md mx-auto"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full font-body transition-all ${
                  activeCategory === category
                    ? 'bg-thread-burgundy text-thread-cream shadow-lg'
                    : 'bg-white/50 text-thread-charcoal hover:bg-thread-gold/20'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Design Gallery */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDesigns.map((design, index) => (
              <DesignCard
                key={design.id}
                design={design}
                index={index}
                onSelect={handleSelectDesign}
              />
            ))}
          </div>

          {filteredDesigns.length === 0 && (
            <div className="text-center py-20">
              <p className="font-body text-thread-charcoal/60 text-lg">
                No designs found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-thread-gold/20 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-body text-thread-charcoal/60">
            © 2026 Embroidery Gallery. Crafted with 🧵 and love.
          </p>
        </div>
      </footer>

      {/* Order Modal */}
      <OrderModal
        design={selectedDesign}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        twitchUser={twitchUser}
      />
    </main>
  )
}

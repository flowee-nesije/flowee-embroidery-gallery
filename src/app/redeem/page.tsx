'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import OrderModal from '@/components/OrderModal'
import type { Design } from '@/lib/supabase'

// Demo designs
const DEMO_DESIGNS: Design[] = [
  {
    id: '1',
    name: 'The Bird',
    description: 'A delicate songbird perched on a flowering branch.',
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
    description: 'Intricate mandala pattern with floral elements.',
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
    description: 'Layered mountain silhouettes against a gradient sunset.',
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop',
    category: 'Landscape',
    available_sizes: ['M', 'L', 'XL', '2XL'],
    available_textiles: ['T-Shirt', 'Hoodie', 'Jacket'],
    is_active: true,
    created_at: new Date().toISOString(),
  },
]

export default function RedeemPage() {
  const [code, setCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<'idle' | 'valid' | 'invalid' | 'used'>('idle')
  const [codeDescription, setCodeDescription] = useState('')
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [designs] = useState<Design[]>(DEMO_DESIGNS)

  const validateCode = async () => {
    if (!code.trim()) return

    setIsValidating(true)
    setValidationResult('idle')

    try {
      const response = await fetch('/api/codes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.toUpperCase() }),
      })

      const data = await response.json()

      if (response.ok && data.valid) {
        setValidationResult('valid')
        setCodeDescription(data.description || 'Your code is valid!')
      } else if (data.used) {
        setValidationResult('used')
      } else {
        setValidationResult('invalid')
      }
    } catch {
      setValidationResult('invalid')
    } finally {
      setIsValidating(false)
    }
  }

  const handleDesignSelect = (design: Design) => {
    setSelectedDesign(design)
    setIsModalOpen(true)
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-thread-gold/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-thread-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-thread-charcoal mb-4">
              Redeem Your Code
            </h1>
            <p className="font-body text-lg text-thread-charcoal/70 mb-8">
              Got a special code from the stream? Enter it below to claim your exclusive embroidery!
            </p>
          </motion.div>

          {/* Code Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase())
                  setValidationResult('idle')
                }}
                placeholder="ENTER-YOUR-CODE"
                className="input-field font-mono text-lg tracking-widest text-center sm:text-left flex-1"
                maxLength={20}
              />
              <button
                onClick={validateCode}
                disabled={isValidating || !code.trim()}
                className="btn-primary whitespace-nowrap disabled:opacity-50"
              >
                {isValidating ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Validating...
                  </span>
                ) : (
                  'Validate Code'
                )}
              </button>
            </div>

            {/* Validation Result */}
            {validationResult === 'valid' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-thread-sage/20 border border-thread-sage rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-thread-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div className="text-left">
                    <p className="font-body font-medium text-thread-charcoal">Code Valid!</p>
                    <p className="font-body text-sm text-thread-charcoal/70">{codeDescription}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {validationResult === 'invalid' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <p className="font-body text-red-700">Invalid code. Please check and try again.</p>
                </div>
              </motion.div>
            )}

            {validationResult === 'used' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="font-body text-amber-700">This code has already been used.</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Design Selection (shown when code is valid) */}
      {validationResult === 'valid' && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 pb-20"
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-2xl font-semibold text-thread-charcoal text-center mb-8">
              Choose Your Design
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {designs.map((design) => (
                <motion.div
                  key={design.id}
                  whileHover={{ scale: 1.02 }}
                  className="glass-card overflow-hidden cursor-pointer"
                  onClick={() => handleDesignSelect(design)}
                >
                  <div className="aspect-square">
                    <img src={design.image_url} alt={design.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg font-semibold text-thread-charcoal">{design.name}</h3>
                    <p className="font-body text-sm text-thread-charcoal/70">{design.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Order Modal */}
      <OrderModal
        design={selectedDesign}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        redemptionCode={code}
      />
    </main>
  )
}

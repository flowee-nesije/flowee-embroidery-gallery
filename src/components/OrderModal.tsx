'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Design } from '@/lib/supabase'

interface OrderModalProps {
  design: Design | null
  isOpen: boolean
  onClose: () => void
  twitchUser?: {
    display_name: string
    email?: string
  } | null
  redemptionCode?: string
}

export default function OrderModal({ design, isOpen, onClose, twitchUser, redemptionCode }: OrderModalProps) {
  const [formData, setFormData] = useState({
    twitchUsername: twitchUser?.display_name || '',
    email: twitchUser?.email || '',
    size: '',
    textile: '',
    code: redemptionCode || '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!design) return

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          designId: design.id,
          designName: design.name,
          twitchUsername: formData.twitchUsername,
          email: formData.email,
          size: formData.size,
          textile: formData.textile,
          redemptionCode: formData.code || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit order')
      }

      setSubmitStatus('success')
      setTimeout(() => {
        onClose()
        setSubmitStatus('idle')
        setFormData({ twitchUsername: '', email: '', size: '', textile: '', code: '' })
      }, 2000)
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!design) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop + Centering Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-thread-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto glass-card p-6 md:p-8 my-auto"
            >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-thread-charcoal/60 hover:text-thread-charcoal transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="flex gap-6 mb-6">
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 stitch-border">
                <img src={design.image_url} alt={design.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-semibold text-thread-charcoal">
                  {design.name}
                </h2>
                <p className="text-thread-charcoal/70 font-body mt-1">
                  {design.description}
                </p>
              </div>
            </div>

            <div className="thread-line mb-6" />

            {/* Success State */}
            {submitStatus === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-thread-sage/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-thread-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display text-xl font-semibold text-thread-charcoal mb-2">
                  Order Submitted!
                </h3>
                <p className="text-thread-charcoal/70 font-body">
                  Your selection has been received. Check your email for confirmation.
                </p>
              </motion.div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Twitch Username */}
                <div>
                  <label className="block font-body font-medium text-thread-charcoal mb-2">
                    Twitch Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.twitchUsername}
                    onChange={(e) => setFormData({ ...formData, twitchUsername: e.target.value })}
                    placeholder="your_twitch_name"
                    className="input-field"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block font-body font-medium text-thread-charcoal mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="input-field"
                  />
                </div>

                {/* Size Selection */}
                <div>
                  <label className="block font-body font-medium text-thread-charcoal mb-2">
                    Size *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {design.available_sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setFormData({ ...formData, size })}
                        className={`px-4 py-2 rounded-lg border-2 font-body transition-all ${
                          formData.size === size
                            ? 'border-thread-burgundy bg-thread-burgundy text-thread-cream'
                            : 'border-fabric-canvas hover:border-thread-gold'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textile Selection */}
                <div>
                  <label className="block font-body font-medium text-thread-charcoal mb-2">
                    Textile Type *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {design.available_textiles.map((textile) => (
                      <button
                        key={textile}
                        type="button"
                        onClick={() => setFormData({ ...formData, textile })}
                        className={`px-4 py-3 rounded-lg border-2 font-body text-left transition-all ${
                          formData.textile === textile
                            ? 'border-thread-burgundy bg-thread-burgundy text-thread-cream'
                            : 'border-fabric-canvas hover:border-thread-gold'
                        }`}
                      >
                        {textile}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Redemption Code (Optional) */}
                <div>
                  <label className="block font-body font-medium text-thread-charcoal mb-2">
                    Redemption Code <span className="text-thread-charcoal/50">(if you have one)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="ENTER-CODE-HERE"
                    className="input-field font-mono tracking-wider"
                  />
                </div>

                {/* Error Message */}
                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-body"
                  >
                    {errorMessage}
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.size || !formData.textile}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Order
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

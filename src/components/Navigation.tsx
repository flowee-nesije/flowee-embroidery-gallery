'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface NavigationProps {
  twitchUser?: {
    display_name: string
    profile_image_url: string
  } | null
}

export default function Navigation({ twitchUser }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-card mx-4 mt-4 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-thread-burgundy flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-thread-cream" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-display text-xl font-semibold text-thread-charcoal">
              Embroidery<span className="text-thread-burgundy">Gallery</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="font-body text-thread-charcoal hover:text-thread-burgundy transition-colors">
              Gallery
            </Link>
            <Link href="/redeem" className="font-body text-thread-charcoal hover:text-thread-burgundy transition-colors">
              Redeem Code
            </Link>
            
            {twitchUser ? (
              <div className="flex items-center gap-3 pl-4 border-l-2 border-thread-gold/30">
                <img 
                  src={twitchUser.profile_image_url} 
                  alt={twitchUser.display_name}
                  className="w-8 h-8 rounded-full border-2 border-thread-gold"
                />
                <span className="font-body font-medium text-thread-charcoal">
                  {twitchUser.display_name}
                </span>
              </div>
            ) : (
              <Link href="/api/auth/twitch" className="btn-secondary text-sm">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                  </svg>
                  Login with Twitch
                </span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-thread-charcoal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pt-4 border-t border-thread-gold/20"
            >
              <div className="flex flex-col gap-4">
                <Link href="/" className="font-body text-thread-charcoal hover:text-thread-burgundy transition-colors">
                  Gallery
                </Link>
                <Link href="/redeem" className="font-body text-thread-charcoal hover:text-thread-burgundy transition-colors">
                  Redeem Code
                </Link>
                {!twitchUser && (
                  <Link href="/api/auth/twitch" className="btn-secondary text-sm text-center">
                    Login with Twitch
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

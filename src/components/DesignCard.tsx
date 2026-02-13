'use client'

import { motion } from 'framer-motion'
import type { Design } from '@/lib/supabase'

interface DesignCardProps {
  design: Design
  index: number
  onSelect: (design: Design) => void
}

export default function DesignCard({ design, index, onSelect }: DesignCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="embroidery-card glass-card overflow-hidden cursor-pointer group"
      onClick={() => onSelect(design)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={design.image_url}
          alt={design.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-thread-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-thread-cream text-sm font-body line-clamp-2">
              {design.description}
            </p>
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-thread-burgundy/90 text-thread-cream text-xs font-body rounded-full backdrop-blur-sm">
            {design.category}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-display text-xl font-semibold text-thread-charcoal mb-2 group-hover:text-thread-burgundy transition-colors">
          {design.name}
        </h3>
        
        {/* Available options */}
        <div className="flex flex-wrap gap-2 mt-3">
          {design.available_textiles.slice(0, 3).map((textile) => (
            <span 
              key={textile}
              className="px-2 py-1 bg-fabric-canvas/50 text-thread-charcoal/70 text-xs font-body rounded"
            >
              {textile}
            </span>
          ))}
          {design.available_textiles.length > 3 && (
            <span className="px-2 py-1 text-thread-gold text-xs font-body">
              +{design.available_textiles.length - 3} more
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-thread-charcoal/60 font-body">
            {design.available_sizes.length} sizes available
          </span>
          <motion.span 
            className="text-thread-burgundy font-medium flex items-center gap-1"
            whileHover={{ x: 5 }}
          >
            Select
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.span>
        </div>
      </div>
    </motion.div>
  )
}

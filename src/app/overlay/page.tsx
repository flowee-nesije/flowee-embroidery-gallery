'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

interface StreamNotification {
  id: string
  username: string
  design: string
  timestamp: Date
}

export default function StreamOverlay() {
  const [notifications, setNotifications] = useState<StreamNotification[]>([])

  useEffect(() => {
    // Subscribe to new orders in real-time
    const channel = supabase
      .channel('stream-orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          const order = payload.new as {
            id: string
            twitch_username: string
            design_name: string
          }
          
          // Add new notification
          const notification: StreamNotification = {
            id: order.id,
            username: order.twitch_username,
            design: order.design_name,
            timestamp: new Date(),
          }
          
          setNotifications((prev) => [...prev, notification])
          
          // Remove notification after 5 seconds
          setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
          }, 5000)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // This page is transparent - meant to be used as OBS browser source
  return (
    <div className="fixed inset-0 pointer-events-none stream-overlay overflow-hidden">
      {/* Notifications appear in bottom-right corner */}
      <div className="absolute bottom-8 right-8 flex flex-col gap-4 items-end">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ x: 300, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 300, opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative"
            >
              {/* Embroidery frame effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-thread-gold via-thread-copper to-thread-gold rounded-xl opacity-80" />
              <div className="absolute -inset-[3px] border-2 border-dashed border-thread-cream/50 rounded-xl" />
              
              <div className="relative bg-gradient-to-br from-thread-charcoal via-thread-navy to-thread-burgundy rounded-xl p-5 shadow-2xl min-w-[300px]">
                {/* Decorative corner stitches */}
                <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-thread-gold" />
                <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-thread-gold" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-thread-gold" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-thread-gold" />

                {/* Content */}
                <div className="flex items-center gap-4">
                  {/* Thread icon */}
                  <div className="w-12 h-12 rounded-full bg-thread-gold/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-thread-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  
                  <div>
                    <motion.p 
                      className="text-thread-gold font-display text-lg font-semibold"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {notification.username}
                    </motion.p>
                    <motion.p 
                      className="text-thread-cream/90 font-body"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      picked up <span className="text-thread-gold font-medium">{notification.design}</span>
                    </motion.p>
                  </div>
                </div>

                {/* Animated thread decoration */}
                <motion.div
                  className="absolute bottom-0 left-5 right-5 h-0.5 bg-gradient-to-r from-transparent via-thread-gold to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Test button (only visible during development) */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={() => {
            const testNotification: StreamNotification = {
              id: Date.now().toString(),
              username: 'TestViewer',
              design: 'The Bird',
              timestamp: new Date(),
            }
            setNotifications((prev) => [...prev, testNotification])
            setTimeout(() => {
              setNotifications((prev) => prev.filter((n) => n.id !== testNotification.id))
            }, 5000)
          }}
          className="fixed top-4 left-4 px-4 py-2 bg-thread-burgundy text-thread-cream rounded pointer-events-auto"
        >
          Test Notification
        </button>
      )}
    </div>
  )
}

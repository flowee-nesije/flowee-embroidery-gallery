'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Order {
  id: string
  design_name: string
  twitch_username: string
  email: string
  textile_type: string
  size: string
  redemption_code: string | null
  status: string
  created_at: string
}

interface RedemptionCode {
  id: string
  code: string
  description: string
  is_used: boolean
  used_by: string | null
  expires_at: string | null
  created_at: string
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<'orders' | 'codes'>('orders')
  const [orders, setOrders] = useState<Order[]>([])
  const [codes, setCodes] = useState<RedemptionCode[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [newCodeDescription, setNewCodeDescription] = useState('')
  const [newCodeExpiry, setNewCodeExpiry] = useState('24')
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)

  const authenticate = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/orders', {
        headers: { 'x-admin-key': adminKey },
      })
      if (response.ok) {
        setIsAuthenticated(true)
        localStorage.setItem('admin_key', adminKey)
        fetchData()
      } else {
        alert('Invalid admin key')
      }
    } catch {
      alert('Authentication failed')
    }
    setIsLoading(false)
  }

  const fetchData = async () => {
    const storedKey = localStorage.getItem('admin_key') || adminKey
    setIsLoading(true)

    try {
      // Fetch orders
      const ordersRes = await fetch('/api/orders', {
        headers: { 'x-admin-key': storedKey },
      })
      if (ordersRes.ok) {
        const data = await ordersRes.json()
        setOrders(data.orders || [])
      }

      // Fetch codes
      const codesRes = await fetch('/api/codes/generate', {
        headers: { 'x-admin-key': storedKey },
      })
      if (codesRes.ok) {
        const data = await codesRes.json()
        setCodes(data.codes || [])
      }
    } catch (err) {
      console.error('Fetch error:', err)
    }
    setIsLoading(false)
  }

  const generateNewCode = async () => {
    const storedKey = localStorage.getItem('admin_key') || adminKey
    setIsLoading(true)

    try {
      const response = await fetch('/api/codes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': storedKey,
        },
        body: JSON.stringify({
          description: newCodeDescription || 'Stream giveaway prize',
          expiresIn: parseInt(newCodeExpiry) || 24,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedCode(data.code.code)
        setNewCodeDescription('')
        fetchData()
      } else {
        alert('Failed to generate code')
      }
    } catch {
      alert('Failed to generate code')
    }
    setIsLoading(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  useEffect(() => {
    const storedKey = localStorage.getItem('admin_key')
    if (storedKey) {
      setAdminKey(storedKey)
      setIsAuthenticated(true)
      fetchData()
    }
  }, [])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 w-full max-w-md"
        >
          <h1 className="font-display text-2xl font-bold text-thread-charcoal mb-6 text-center">
            Admin Access
          </h1>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Enter admin key"
            className="input-field mb-4"
            onKeyDown={(e) => e.key === 'Enter' && authenticate()}
          />
          <button
            onClick={authenticate}
            disabled={isLoading}
            className="w-full btn-primary"
          >
            {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-thread-charcoal">
            Admin Panel
          </h1>
          <button
            onClick={() => {
              localStorage.removeItem('admin_key')
              setIsAuthenticated(false)
              setAdminKey('')
            }}
            className="text-thread-charcoal/60 hover:text-thread-burgundy transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-lg font-body transition-all ${
              activeTab === 'orders'
                ? 'bg-thread-burgundy text-thread-cream'
                : 'bg-white/50 hover:bg-thread-gold/20'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('codes')}
            className={`px-6 py-3 rounded-lg font-body transition-all ${
              activeTab === 'codes'
                ? 'bg-thread-burgundy text-thread-cream'
                : 'bg-white/50 hover:bg-thread-gold/20'
            }`}
          >
            Redemption Codes ({codes.length})
          </button>
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="ml-auto px-4 py-3 bg-thread-gold/20 rounded-lg hover:bg-thread-gold/30 transition-colors"
          >
            {isLoading ? '↻ Loading...' : '↻ Refresh'}
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-thread-charcoal/5">
                  <tr>
                    <th className="text-left p-4 font-body font-medium">Date</th>
                    <th className="text-left p-4 font-body font-medium">User</th>
                    <th className="text-left p-4 font-body font-medium">Design</th>
                    <th className="text-left p-4 font-body font-medium">Details</th>
                    <th className="text-left p-4 font-body font-medium">Code</th>
                    <th className="text-left p-4 font-body font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-thread-charcoal/60">
                        No orders yet
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="border-t border-thread-gold/10">
                        <td className="p-4 font-body text-sm">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="font-body font-medium">{order.twitch_username}</div>
                          <div className="font-body text-sm text-thread-charcoal/60">{order.email}</div>
                        </td>
                        <td className="p-4 font-body">{order.design_name}</td>
                        <td className="p-4 font-body text-sm">
                          {order.textile_type} / {order.size}
                        </td>
                        <td className="p-4 font-mono text-sm">
                          {order.redemption_code || '-'}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-body ${
                            order.status === 'completed' ? 'bg-thread-sage/20 text-thread-sage' :
                            order.status === 'confirmed' ? 'bg-thread-gold/20 text-thread-copper' :
                            'bg-thread-charcoal/10 text-thread-charcoal'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Codes Tab */}
        {activeTab === 'codes' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Generate New Code */}
            <div className="glass-card p-6 mb-6">
              <h2 className="font-display text-xl font-semibold mb-4">Generate New Code</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  value={newCodeDescription}
                  onChange={(e) => setNewCodeDescription(e.target.value)}
                  placeholder="Description (e.g., Top donator prize)"
                  className="input-field flex-1"
                />
                <select
                  value={newCodeExpiry}
                  onChange={(e) => setNewCodeExpiry(e.target.value)}
                  className="input-field w-full md:w-40"
                >
                  <option value="1">1 hour</option>
                  <option value="6">6 hours</option>
                  <option value="24">24 hours</option>
                  <option value="48">48 hours</option>
                  <option value="168">1 week</option>
                </select>
                <button
                  onClick={generateNewCode}
                  disabled={isLoading}
                  className="btn-primary whitespace-nowrap"
                >
                  Generate Code
                </button>
              </div>

              {/* Generated Code Display */}
              {generatedCode && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-thread-sage/20 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <p className="font-body text-sm text-thread-charcoal/70 mb-1">New code generated:</p>
                    <p className="font-mono text-2xl font-bold text-thread-charcoal tracking-wider">
                      {generatedCode}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(generatedCode)}
                    className="px-4 py-2 bg-white rounded-lg hover:bg-thread-gold/20 transition-colors"
                  >
                    📋 Copy
                  </button>
                </motion.div>
              )}
            </div>

            {/* Codes List */}
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-thread-charcoal/5">
                    <tr>
                      <th className="text-left p-4 font-body font-medium">Code</th>
                      <th className="text-left p-4 font-body font-medium">Description</th>
                      <th className="text-left p-4 font-body font-medium">Expires</th>
                      <th className="text-left p-4 font-body font-medium">Status</th>
                      <th className="text-left p-4 font-body font-medium">Used By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {codes.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-thread-charcoal/60">
                          No codes generated yet
                        </td>
                      </tr>
                    ) : (
                      codes.map((code) => (
                        <tr key={code.id} className="border-t border-thread-gold/10">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-medium">{code.code}</span>
                              <button
                                onClick={() => copyToClipboard(code.code)}
                                className="text-thread-charcoal/40 hover:text-thread-charcoal"
                              >
                                📋
                              </button>
                            </div>
                          </td>
                          <td className="p-4 font-body text-sm">{code.description}</td>
                          <td className="p-4 font-body text-sm">
                            {code.expires_at 
                              ? new Date(code.expires_at).toLocaleString()
                              : 'Never'}
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-body ${
                              code.is_used 
                                ? 'bg-thread-charcoal/10 text-thread-charcoal' 
                                : 'bg-thread-sage/20 text-thread-sage'
                            }`}>
                              {code.is_used ? 'Used' : 'Available'}
                            </span>
                          </td>
                          <td className="p-4 font-body text-sm">
                            {code.used_by || '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface OrderItem {
  id: string
  name: string
  price: number
  size: string
  quantity: number
}

export interface Order {
  id: string
  trackingCode: string
  timestamp: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  items: OrderItem[]
  subtotal: number
  discount: number
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
}

interface OrderContextType {
  orders: Order[]
  addOrder: (order: Omit<Order, 'id' | 'trackingCode' | 'timestamp'>) => Order
  updateOrderStatus: (id: string, status: Order['status']) => void
  deleteOrder: (id: string) => void
  getOrderByTrackingCode: (trackingCode: string) => Order | undefined
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

// Generate unique 6-character tracking code (letters + numbers)
const generateTrackingCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('orders')
    if (stored) {
      try {
        setOrders(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to load orders:', e)
      }
    }
  }, [])

  const addOrder = (order: Omit<Order, 'id' | 'trackingCode' | 'timestamp'>) => {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      trackingCode: generateTrackingCode(),
      timestamp: new Date().toLocaleString('en-BD', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    }

    const updatedOrders = [newOrder, ...orders]
    setOrders(updatedOrders)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
    return newOrder
  }

  const updateOrderStatus = (id: string, status: Order['status']) => {
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, status } : order
    )
    setOrders(updatedOrders)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
  }

  const deleteOrder = (id: string) => {
    const updatedOrders = orders.filter((order) => order.id !== id)
    setOrders(updatedOrders)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
  }

  const getOrderByTrackingCode = (trackingCode: string): Order | undefined => {
    return orders.find(
      (order) => order.trackingCode.toUpperCase() === trackingCode.toUpperCase()
    )
  }

  return (
    <OrderContext.Provider
      value={{ orders, addOrder, updateOrderStatus, deleteOrder, getOrderByTrackingCode }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider')
  }
  return context
}

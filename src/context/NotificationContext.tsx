'use client'

import React, { createContext, useContext, useState } from 'react'

export interface JustShown {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

interface NotificationContextType {
  addNotification: (notification: Omit<JustShown, 'id'>) => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<JustShown[]>([])

  const addNotification = (notification: Omit<JustShown, 'id'>) => {
    const id = Date.now().toString()
    const duration = notification.duration || 3000

    setNotifications((prev) => [...prev, { ...notification, id }])

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}

      {/* Notification Toast Container */}
      <div className="fixed bottom-4 right-4 space-y-3 z-[9999] pointer-events-none">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`animate-slide-in px-4 py-3 rounded-lg text-white shadow-lg pointer-events-auto ${
              notification.type === 'success'
                ? 'bg-green-500'
                : notification.type === 'error'
                ? 'bg-red-500'
                : notification.type === 'warning'
                ? 'bg-yellow-500'
                : 'bg-blue-500'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return context
}

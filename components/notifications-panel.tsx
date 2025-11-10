"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Check, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  metadata?: Record<string, unknown>
  createdAt: string
}

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications")
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
        setUnreadCount(data.filter((n: Notification) => !n.read).length)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  useEffect(() => {
    const initializeNotifications = async () => {
      await fetchNotifications()
    }
    initializeNotifications()
  }, [])

  useEffect(() => {
    if (isOpen) {
      const loadNotifications = async () => {
        await fetchNotifications()
      }
      loadNotifications()
    }
  }, [isOpen])

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId,
          read: true,
        }),
      })

      if (response.ok) {
        fetchNotifications()
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications?id=${notificationId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchNotifications()
      }
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "POST",
      })

      if (response.ok) {
        fetchNotifications()
      }
    } catch (error) {
      console.error("Error marking all as read:", error)
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    // Marquer comme lu si pas déjà lu
    if (!notification.read) {
      await markAsRead(notification.id)
    }

    // Rediriger vers le lien dans metadata si disponible
    if (notification.metadata?.link) {
      router.push(notification.metadata.link as string)
      setIsOpen(false)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "INVITATION_RECEIVED":
        return "📨"
      case "INVITATION_ACCEPTED":
        return "✅"
      case "INVITATION_DECLINED":
        return "❌"
      case "TEAM_VALIDATED":
        return "🎉"
      default:
        return "🔔"
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          {unreadCount > 0 && (
            <SheetDescription>
              Vous avez {unreadCount} notification{unreadCount > 1 ? "s" : ""} non lue{unreadCount > 1 ? "s" : ""}
            </SheetDescription>
          )}
        </SheetHeader>

        <div className="mt-4 flex justify-between">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
            >
              <Check className="size-4" />
              Tout marquer comme lu
            </Button>
          )}
        </div>

        <ScrollArea className="h-[calc(100vh-180px)] mt-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="size-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune notification</p>
            </div>
          ) : (
            <div className="space-y-4 px-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-lg border p-4 cursor-pointer transition-colors hover:bg-accent/70 ${
                    !notification.read ? "bg-accent/50" : "bg-card"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <h4 className="font-semibold text-sm">
                          {notification.title}
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            markAsRead(notification.id)
                          }}
                        >
                          <Check className="size-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

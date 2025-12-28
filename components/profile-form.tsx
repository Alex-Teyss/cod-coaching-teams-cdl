"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ImageUpload } from "@/components/image-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface ProfileFormProps {
  user: {
    id: string
    username: string
    email: string
    image?: string | null
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState(user.username)
  const [image, setImage] = useState(user.image || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          image,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      router.refresh()
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ImageUpload
        value={image}
        onChange={setImage}
        onRemove={() => setImage("")}
        endpoint="profileImage"
        label="Photo de profil"
        disabled={isLoading}
      />

      <div className="space-y-2">
        <Label htmlFor="username">Nom d&apos;utilisateur</Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={user.email}
          disabled
        />
        <p className="text-xs text-muted-foreground">
          L&apos;email ne peut pas être modifié
        </p>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="size-4 animate-spin" />}
        Enregistrer les modifications
      </Button>
    </form>
  )
}

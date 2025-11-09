"use client"

import { useState } from "react"
import { useUploadThing } from "@/lib/uploadthing"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value?: string | null
  onChange: (url: string) => void
  onRemove?: () => void
  endpoint: "profileImage" | "teamImage"
  className?: string
  avatarClassName?: string
  label?: string
  disabled?: boolean
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  endpoint,
  className,
  avatarClassName,
  label,
  disabled,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const { startUpload } = useUploadThing(endpoint)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      setIsUploading(true)
      const uploadedFiles = await startUpload(Array.from(files))

      if (uploadedFiles && uploadedFiles[0]) {
        onChange(uploadedFiles[0].url)
      }
    } catch (error) {
      console.error("Error uploading file:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}

      <div className="flex items-center gap-4">
        <Avatar className={cn("size-20", avatarClassName)}>
          <AvatarImage src={value || undefined} alt="Image" />
          <AvatarFallback>
            <Upload className="size-8 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading || disabled}
            onClick={() => document.getElementById(`file-input-${endpoint}`)?.click()}
          >
            {isUploading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Upload...
              </>
            ) : (
              <>
                <Upload className="size-4" />
                {value ? "Changer" : "Upload"}
              </>
            )}
          </Button>

          {value && onRemove && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading || disabled}
              onClick={onRemove}
            >
              <X className="size-4" />
              Supprimer
            </Button>
          )}
        </div>

        <input
          id={`file-input-${endpoint}`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
          disabled={isUploading || disabled}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Formats acceptés: JPG, PNG, GIF. Taille max: 4MB
      </p>
    </div>
  )
}

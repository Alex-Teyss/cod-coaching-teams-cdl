import { createUploadthing, type FileRouter } from "uploadthing/next"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

const f = createUploadthing()

export const ourFileRouter = {
  profileImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      })

      if (!session?.user) {
        throw new Error("Unauthorized")
      }

      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Profile image upload complete for userId:", metadata.userId)
      console.log("File URL:", file.url)

      return { uploadedBy: metadata.userId, url: file.url }
    }),

  teamImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      })

      if (!session?.user) {
        throw new Error("Unauthorized")
      }

      // Only coaches and admins can upload team images
      if (session.user.role !== "COACH" && session.user.role !== "ADMIN") {
        throw new Error("Only coaches and admins can upload team images")
      }

      return { userId: session.user.id, role: session.user.role }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Team image upload complete for userId:", metadata.userId)
      console.log("File URL:", file.url)

      return { uploadedBy: metadata.userId, url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

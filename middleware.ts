import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Chemins publics qui ne nécessitent pas d'authentification
  const publicPaths = ["/login", "/signup", "/", "/contact", "/api/contact", "/api/auth"]
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // Chemins d'onboarding
  const isOnboardingPath = pathname.startsWith("/onboarding")

  // Toujours permettre l'accès aux chemins publics
  if (isPublicPath) {
    return NextResponse.next()
  }

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    // Si l'utilisateur n'est pas authentifié et essaie d'accéder à une page protégée
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Si l'utilisateur est authentifié
    if (session?.user) {
      // Si l'utilisateur n'a pas complété son onboarding et n'est pas déjà sur la page d'onboarding
      // Cela s'applique principalement aux inscriptions OAuth qui doivent choisir leur rôle
      if (!session.user.onboardingCompleted && !isOnboardingPath) {
        return NextResponse.redirect(new URL("/onboarding/role", request.url))
      }

      // Si l'utilisateur a complété son onboarding mais est sur une page d'onboarding
      if (session.user.onboardingCompleted && isOnboardingPath) {
        // Rediriger vers le dashboard approprié
        const role = session.user.role?.toUpperCase()
        if (role === "COACH") {
          return NextResponse.redirect(new URL("/coach/dashboard", request.url))
        } else if (role === "PLAYER") {
          return NextResponse.redirect(new URL("/player/dashboard", request.url))
        } else if (role === "ADMIN") {
          return NextResponse.redirect(new URL("/admin/dashboard", request.url))
        }
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    // En cas d'erreur, permettre l'accès plutôt que de bloquer
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg).*)",
  ],
}

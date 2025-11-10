import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Chemins publics qui ne nécessitent pas d'authentification
  const publicPaths = ["/login", "/signup", "/", "/contact", "/api/contact", "/api/auth", "/invite", "/forgot-password", "/reset-password"]
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // Chemins d'onboarding
  const isOnboardingPath = pathname.startsWith("/onboarding")
  const isCoachOnboardingPath = pathname.startsWith("/coach/onboarding")
  const isPlayerOnboardingPath = pathname.startsWith("/player/onboarding")

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
      const role = session.user.role?.toUpperCase()
      const onboardingCompleted = session.user.onboardingCompleted

      // Si l'utilisateur n'a pas de rôle, rediriger vers la sélection de rôle
      if (!role && !isOnboardingPath) {
        return NextResponse.redirect(new URL("/onboarding/role", request.url))
      }

      // Si l'utilisateur n'a pas complété son onboarding
      if (!onboardingCompleted) {
        // Si c'est un coach et qu'il n'est pas sur la page d'onboarding coach, rediriger
        if (role === "COACH" && !isCoachOnboardingPath && !isOnboardingPath) {
          return NextResponse.redirect(new URL("/coach/onboarding", request.url))
        }
        // Si c'est un joueur et qu'il n'est pas sur la page d'onboarding joueur ou sélection de rôle
        if (role === "PLAYER" && !isPlayerOnboardingPath && !isOnboardingPath && pathname !== "/player/dashboard") {
          // Les joueurs peuvent accéder au dashboard même sans onboarding complété
          // car ils peuvent avoir été invités et doivent compléter leur profil
          if (!pathname.startsWith("/player")) {
            return NextResponse.redirect(new URL("/player/dashboard", request.url))
          }
        }
        // Si l'utilisateur n'a pas de rôle défini, rediriger vers la sélection
        if (!role && !isOnboardingPath) {
          return NextResponse.redirect(new URL("/onboarding/role", request.url))
        }
      }

      // Si l'utilisateur a complété son onboarding mais est sur une page d'onboarding
      if (onboardingCompleted && (isOnboardingPath || isCoachOnboardingPath || isPlayerOnboardingPath)) {
        // Rediriger vers le dashboard approprié
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
    console.error("Proxy error:", error)
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

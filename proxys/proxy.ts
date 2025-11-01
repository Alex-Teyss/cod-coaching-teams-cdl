import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const pathname = request.nextUrl.pathname;

  // Routes protégées par rôle
  const isAdminRoute = pathname.startsWith("/admin");
  const isCoachRoute = pathname.startsWith("/coach");

  // Si pas de session et tentative d'accès à une route protégée
  if (!session && (isAdminRoute || isCoachRoute)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "auth_required");
    loginUrl.searchParams.set("message", "Vous devez être connecté pour accéder à cette page");
    return NextResponse.redirect(loginUrl);
  }

  // Si session existe, vérifier les rôles
  if (session) {
    const userRole = session.user.role;

    // Bloquer l'accès admin aux non-admins
    if (isAdminRoute && userRole !== "ADMIN") {
      const homeUrl = new URL("/", request.url);
      homeUrl.searchParams.set("error", "access_denied");
      homeUrl.searchParams.set("message", "Vous n'avez pas les permissions pour accéder à cette page");
      return NextResponse.redirect(homeUrl);
    }

    // Bloquer l'accès coach aux joueurs
    if (isCoachRoute && userRole !== "COACH" && userRole !== "ADMIN") {
      const homeUrl = new URL("/", request.url);
      homeUrl.searchParams.set("error", "access_denied");
      homeUrl.searchParams.set("message", "Vous n'avez pas les permissions pour accéder à cette page");
      return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/coach/:path*"],
};

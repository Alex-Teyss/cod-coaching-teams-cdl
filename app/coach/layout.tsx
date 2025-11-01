import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || (session.user.role !== "COACH" && session.user.role !== "ADMIN")) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold">Coach</h1>
              <nav className="flex gap-4">
                <Link
                  href="/coach/dashboard"
                  className="text-sm font-medium hover:text-primary"
                >
                  Dashboard
                </Link>
                <Link
                  href="/coach/teams/new"
                  className="text-sm font-medium hover:text-primary"
                >
                  Créer une équipe
                </Link>
                <Link
                  href="/coach/invitations"
                  className="text-sm font-medium hover:text-primary"
                >
                  Invitations
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {session.user.name}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  );
}

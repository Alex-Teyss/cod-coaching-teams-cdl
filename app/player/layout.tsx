import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PlayerSidebar } from "@/components/sidebar/player-sidebar";

export default async function PlayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <PlayerSidebar userName={session.user.name} />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  );
}

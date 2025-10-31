"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSession, signOut } from "@/lib/auth-client";
import Link from "next/link";
import { AppleHelloEnglishEffect } from "@/components/ui/shadcn-io/apple-hello-effect";

export default function Home() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <h1 className="text-2xl text-black">Cod Coaching Teams V1</h1>
        <AppleHelloEnglishEffect speed={1.1} />
        <p className="text-gray-600 mb-4">Not Authenticated</p>
        <Link href="/login">Se connecter</Link>
        <span>ou</span>
        <Link href="/signup">S&apos;inscrire</Link>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-4">
      <h1 className="text-2xl text-black">Cod Coaching Teams V1</h1>
      <p className="text-gray-600">Bonjour,</p>
      <div className="flex justify-center items-end gap-4">
        <AppleHelloEnglishEffect speed={1.1} />
        <h1 className="text-3xl">{session.user.name}!</h1>
      </div>
      <p className="text-sm text-gray-500">Email: {session.user.email}</p>
      <Button variant={"destructive"} onClick={handleLogout}>
        Se déconnecter
      </Button>
    </div>
  );
}

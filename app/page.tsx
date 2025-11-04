"use client"

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { AppleHelloEnglishEffect } from "@/components/ui/shadcn-io/apple-hello-effect";
import { ArrowRight, Users, Target, Award } from "lucide-react";

export default function Home() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 md:pt-40 md:pb-24">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <AppleHelloEnglishEffect speed={1.1} />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Coaching d&apos;équipes Call of Duty
              <br />
              <span className="text-primary">Pour la victoire</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Améliorez les performances de votre équipe avec des stratégies professionnelles,
              des analyses détaillées et un coaching personnalisé.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {session ? (
                <Link href="/dashboard">
                  <Button size="lg" className="text-lg px-8">
                    Accéder au Dashboard
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/signup">
                    <Button size="lg" className="text-lg px-8">
                      Commencer gratuitement
                      <ArrowRight className="ml-2" size={20} />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="text-lg px-8">
                      Se connecter
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {session && (
              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Bienvenue, <span className="font-semibold text-foreground">{session.user.name}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pourquoi choisir notre plateforme ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des outils professionnels pour transformer votre équipe en champions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gestion d&apos;équipe</h3>
              <p className="text-muted-foreground">
                Organisez vos équipes, gérez les rôles et suivez les performances de chaque membre.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Stratégies personnalisées</h3>
              <p className="text-muted-foreground">
                Accédez à des stratégies de jeu adaptées à votre style et à votre niveau.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Award className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyses détaillées</h3>
              <p className="text-muted-foreground">
                Visualisez vos statistiques et identifiez les axes d&apos;amélioration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="about" className="py-16 md:py-24">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à dominer la compétition ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Rejoignez des centaines d&apos;équipes qui utilisent déjà notre plateforme
            pour améliorer leurs performances.
          </p>
          {!session && (
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Créer un compte gratuit
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Cod Coaching Teams. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

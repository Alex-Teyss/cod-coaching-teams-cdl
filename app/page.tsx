"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { ArrowRight, Target, Zap, Shield } from "lucide-react";
import { getDashboardRoute } from "@/lib/role-redirect";
import { useMemo } from "react";
import { GradientText } from "@/components/ui/shadcn-io/gradient-text";
import BlurText from "@/components/ui/shadcn-io/blur-text";
import { FlipWords } from "@/components/ui/flip-words";

export default function Home() {
  const { data: session, isPending } = useSession();

  const dashboardRoute = useMemo(() => {
    return getDashboardRoute(session?.user?.role);
  }, [session?.user?.role]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950">
      <Navbar />

      <main id="main-content">
        {/* Hero Section - BG-1 */}
        <section
          className="relative h-[100vh] flex items-center justify-center px-4 bg-background dark:bg-gray-950 overflow-hidden"
          aria-labelledby="hero-title"
        >
          {/* Background decoration BG-1 */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none" aria-hidden="true" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center space-y-10">
              {/* Badge/Tag */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 backdrop-blur-sm">
                <Shield className="text-blue-500" size={16} />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Plateforme de coaching #1 en France
                </span>
              </div>

              {/* Main Content */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <BlurText
                    text="COD Coaching"
                    className="text-4xl md:text-5xl font-bold tracking-tight justify-center"
                    delay={40}
                    animateBy="words"
                  />

                  <div className="text-3xl md:text-4xl font-bold flex justify-center items-center">
                    <FlipWords
                      words={["Niveau Professionnel", "Niveau Challenger", "Niveau Amateur"]}
                      duration={3000}
                      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                    />
                  </div>
                </div>

                <BlurText
                  text="Transformez vos équipes en champions avec des stratégies professionnelles et un accompagnement personnalisé"
                  className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed justify-center"
                  delay={60}
                  animateBy="words"
                  direction="bottom"
                />
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
                {session ? (
                  <Link href={dashboardRoute}>
                    <Button size="lg" className="text-lg px-12 h-16 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
                      Accéder au Dashboard
                      <ArrowRight className="ml-2" size={20} />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/signup">
                      <Button size="lg" className="text-lg px-12 h-16 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
                        Commencer gratuitement
                        <ArrowRight className="ml-2" size={20} />
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button
                        size="lg"
                        variant="outline"
                        className="text-lg px-12 h-16 rounded-full border-2 hover:bg-muted/50 transition-all duration-300 hover:scale-105"
                      >
                        Se connecter
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Social Proof */}
              <div className="pt-6 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Rejoignez plus de 100+ joueurs actifs
                </p>
                <div className="flex justify-center gap-8 flex-wrap">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-background" />
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 border-2 border-background" />
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 border-2 border-background" />
                    </div>
                    <span>100+ joueurs</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="text-blue-500" size={20} />
                    <span>50+ équipes formées</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="text-purple-500" size={20} />
                    <span>Support 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - BG-2 */}
        <section
          id="features"
          className="py-12 md:py-16 bg-muted/30 dark:bg-gray-900/50 relative overflow-hidden"
          aria-labelledby="features-title"
        >
          {/* Background decoration BG-2 */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent pointer-events-none" aria-hidden="true" />
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="container mx-auto max-w-6xl px-4 relative z-10">
            <div className="grid md:grid-cols-3 gap-8">
              <article className="group relative p-8 rounded-2xl border border-border bg-card/50 dark:bg-gray-900/50 backdrop-blur transition-all duration-500 hover:bg-card dark:hover:bg-gray-800/80 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 hover:-translate-y-2 hover:border-blue-500/50 cursor-pointer">
                <div
                  className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-blue-500/20 group-hover:scale-110 group-hover:rotate-3"
                  aria-hidden="true"
                >
                  <Target className="text-blue-500 transition-all duration-500 group-hover:scale-110" size={28} strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-semibold mb-3 transition-colors duration-300 group-hover:text-blue-500">
                  Stratégies Avancées
                </h3>
                <p className="text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-foreground">
                  Tactiques professionnelles adaptées à votre niveau et style de jeu
                </p>
              </article>

              <article className="group relative p-8 rounded-2xl border border-border bg-card/50 dark:bg-gray-900/50 backdrop-blur transition-all duration-500 hover:bg-card dark:hover:bg-gray-800/80 hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/20 hover:-translate-y-2 hover:border-purple-500/50 cursor-pointer">
                <div
                  className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-purple-500/20 group-hover:scale-110 group-hover:rotate-3"
                  aria-hidden="true"
                >
                  <Zap className="text-purple-500 transition-all duration-500 group-hover:scale-110" size={28} strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-semibold mb-3 transition-colors duration-300 group-hover:text-purple-500">
                  Performances
                </h3>
                <p className="text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-foreground">
                  Analysez et améliorez vos statistiques en temps réel
                </p>
              </article>

              <article className="group relative p-8 rounded-2xl border border-border bg-card/50 dark:bg-gray-900/50 backdrop-blur transition-all duration-500 hover:bg-card dark:hover:bg-gray-800/80 hover:shadow-2xl hover:shadow-pink-500/10 dark:hover:shadow-pink-500/20 hover:-translate-y-2 hover:border-pink-500/50 cursor-pointer">
                <div
                  className="w-14 h-14 bg-pink-500/10 rounded-xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-pink-500/20 group-hover:scale-110 group-hover:rotate-3"
                  aria-hidden="true"
                >
                  <Shield className="text-pink-500 transition-all duration-500 group-hover:scale-110" size={28} strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-semibold mb-3 transition-colors duration-300 group-hover:text-pink-500">
                  Gestion d&apos;Équipe
                </h3>
                <p className="text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-foreground">
                  Organisez et suivez la progression de tous vos joueurs
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* CTA Section - BG-1 */}
        <section
          id="about"
          className="py-24 md:py-32 bg-background dark:bg-gray-950 relative overflow-hidden"
          aria-labelledby="cta-title"
        >
          {/* Background decoration BG-1 */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none" aria-hidden="true" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="container mx-auto max-w-5xl px-4 relative z-10">
            <div className="text-center space-y-12">
              {/* Main CTA */}
              <div className="space-y-6">
                <h2 id="cta-title" className="text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white">
                  Prêt à dominer la compétition ?
                </h2>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Rejoignez les équipes d&apos;élite qui transforment leur passion en victoires grâce à notre plateforme de coaching professionnelle
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto py-8">
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                    100+
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground">
                    Joueurs actifs
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                    50+
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground">
                    Équipes formées
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
                    24/7
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground">
                    Support disponible
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                {session ? (
                  <Link href={dashboardRoute}>
                    <Button size="lg" className="text-lg px-12 h-16 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
                      Accéder au Dashboard
                      <ArrowRight className="ml-2" size={20} />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/signup">
                      <Button size="lg" className="text-lg px-12 h-16 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
                        Commencer gratuitement
                        <ArrowRight className="ml-2" size={20} />
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button
                        size="lg"
                        variant="outline"
                        className="text-lg px-12 h-16 rounded-full border-2 hover:bg-muted/50 transition-all duration-300 hover:scale-105"
                      >
                        Se connecter
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Trust badges */}
              <div className="pt-8">
                <p className="text-sm text-muted-foreground mb-4">
                  Plateforme de confiance
                </p>
                <div className="flex flex-wrap justify-center gap-6 items-center opacity-60">
                  <div className="flex items-center gap-2">
                    <Shield size={20} className="text-green-500" />
                    <span className="text-sm">Sécurisé</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target size={20} className="text-blue-500" />
                    <span className="text-sm">Pro certifié</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap size={20} className="text-purple-500" />
                    <span className="text-sm">Résultats rapides</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="border-t border-border py-12 bg-muted/30 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 COD Coaching Teams. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}

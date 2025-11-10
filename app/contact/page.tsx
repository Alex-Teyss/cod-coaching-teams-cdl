"use client";

import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Mail, MessageCircle, MapPin, Phone, Send } from "lucide-react";
import BlurText from "@/components/ui/shadcn-io/blur-text";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Message envoyé avec succès !", {
      description: "Nous vous répondrons dans les plus brefs délais.",
    });

    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950">
      <Navbar />

      <main id="main-content">
        {/* Hero Section */}
        <section
          className="relative pt-32 pb-20 px-4 bg-background dark:bg-gray-950 overflow-hidden"
          aria-labelledby="contact-title"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none" aria-hidden="true" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center space-y-6 mb-16">
              <BlurText
                text="Contactez-nous"
                className="text-4xl md:text-5xl font-bold tracking-tight justify-center"
                delay={40}
                animateBy="words"
              />
              <BlurText
                text="Nous sommes là pour répondre à toutes vos questions"
                className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed justify-center"
                delay={60}
                animateBy="words"
                direction="bottom"
              />
            </div>

            {/* Contact Grid */}
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Contact Information */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">
                    Informations de contact
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    N&apos;hésitez pas à nous contacter pour toute question concernant
                    nos services de coaching, la gestion d&apos;équipe ou pour un
                    partenariat.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="group flex items-start gap-4 p-4 rounded-xl border border-border bg-card/50 dark:bg-gray-900/50 backdrop-blur transition-all duration-300 hover:bg-card dark:hover:bg-gray-800/80 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/50">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-blue-500/20 group-hover:scale-110">
                      <Mail className="text-blue-500" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a
                        href="mailto:contact@codcoachingteams.com"
                        className="text-muted-foreground hover:text-blue-500 transition-colors"
                      >
                        contact@codcoachingteams.com
                      </a>
                    </div>
                  </div>

                  <div className="group flex items-start gap-4 p-4 rounded-xl border border-border bg-card/50 dark:bg-gray-900/50 backdrop-blur transition-all duration-300 hover:bg-card dark:hover:bg-gray-800/80 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/50">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-purple-500/20 group-hover:scale-110">
                      <Phone className="text-purple-500" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Téléphone</h3>
                      <a
                        href="tel:+33123456789"
                        className="text-muted-foreground hover:text-purple-500 transition-colors"
                      >
                        +33 1 23 45 67 89
                      </a>
                    </div>
                  </div>

                  <div className="group flex items-start gap-4 p-4 rounded-xl border border-border bg-card/50 dark:bg-gray-900/50 backdrop-blur transition-all duration-300 hover:bg-card dark:hover:bg-gray-800/80 hover:shadow-lg hover:shadow-pink-500/10 hover:border-pink-500/50">
                    <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-pink-500/20 group-hover:scale-110">
                      <MapPin className="text-pink-500" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Adresse</h3>
                      <p className="text-muted-foreground">
                        123 Avenue des Gamers
                        <br />
                        75001 Paris, France
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-4">
                  <h3 className="font-semibold mb-4">Suivez-nous</h3>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center hover:bg-blue-500/20 transition-all duration-300 hover:scale-110"
                      aria-label="Twitter"
                    >
                      <MessageCircle className="text-blue-500" size={18} />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center hover:bg-purple-500/20 transition-all duration-300 hover:scale-110"
                      aria-label="Discord"
                    >
                      <MessageCircle className="text-purple-500" size={18} />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center hover:bg-pink-500/20 transition-all duration-300 hover:scale-110"
                      aria-label="Instagram"
                    >
                      <MessageCircle className="text-pink-500" size={18} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="relative">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 p-8 rounded-2xl border border-border bg-card/50 dark:bg-gray-900/50 backdrop-blur shadow-xl"
                >
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-foreground"
                    >
                      Nom complet
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background dark:bg-gray-950 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Jean Dupont"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-foreground"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background dark:bg-gray-950 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="jean@exemple.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium text-foreground"
                    >
                      Sujet
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background dark:bg-gray-950 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Question sur le coaching"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-foreground"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background dark:bg-gray-950 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Votre message..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full text-lg h-12 rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
                  >
                    {isSubmitting ? (
                      "Envoi en cours..."
                    ) : (
                      <>
                        Envoyer le message
                        <Send className="ml-2" size={18} />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-muted/30 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="flex justify-center gap-8 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Accueil
            </Link>
            <Link href="/#about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/#features" className="hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; 2025 COD Coaching Teams. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}

import { ContactForm } from "./contact-form";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "@/components/navbar";

export const metadata = {
  title: "Contact - COD Coaching Teams",
  description: "Contactez-nous pour toute question.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden bg-muted/30 py-16 md:py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Contactez-nous
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Une question ? Un projet ? N'hésitez pas à nous écrire. Notre équipe
            vous répondra dans les plus brefs délais.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Info Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            <h3 className="text-2xl font-semibold tracking-tight">
              Nos Coordonnées
            </h3>
            <p className="text-muted-foreground">
              Retrouvez-nous sur nos différents canaux ou passez nous voir.
            </p>

            <div className="space-y-4">
              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">Email</p>
                    <p className="text-sm text-muted-foreground">
                      contact@cod-coaching.com
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      Téléphone
                    </p>
                    <p className="text-sm text-muted-foreground">
                      +33 1 23 45 67 89
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">Adresse</p>
                    <p className="text-sm text-muted-foreground">
                      123 Avenue du Code, Paris
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form Area */}
          <div className="lg:col-span-2">
            <Card className="h-full border-muted bg-card/50 shadow-sm transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Envoyez-nous un message</CardTitle>
                <CardDescription>
                  Remplissez le formulaire ci-dessous et nous reviendrons vers
                  vous rapidement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

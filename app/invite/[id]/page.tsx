"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { playerOnboardingSchema, type PlayerOnboardingFormData } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { signIn, useSession } from "@/lib/auth-client";

interface Invitation {
  id: string;
  email: string;
  status: string;
  expiresAt: string;
  team: {
    name: string;
    coach: {
      name: string;
    };
  };
}

export default function InvitePage() {
  const router = useRouter();
  const params = useParams();
  const invitationId = params?.id as string;
  const { data: session, isPending: isSessionLoading } = useSession();

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
  } = useForm<PlayerOnboardingFormData>({
    resolver: zodResolver(playerOnboardingSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const name = watch("name");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  useEffect(() => {
    if (invitationId) {
      fetchInvitation();
    }
  }, [invitationId]);

  // Si l'utilisateur est déjà connecté et l'invitation correspond à son email, afficher le bouton d'acceptation
  // On ne l'accepte pas automatiquement pour que l'utilisateur puisse voir les détails

  const fetchInvitation = async () => {
    try {
      const response = await fetch(`/api/invitations/${invitationId}/info`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Invitation non trouvée");
      }
      const data = await response.json();
      setInvitation(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Impossible de charger l'invitation");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!invitation || !session?.user) return;

    setError(null);
    setIsAccepting(true);

    try {
      const response = await fetch(`/api/invitations/${invitationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "accept" }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de l'acceptation de l'invitation");
      }

      // Rediriger vers le dashboard
      router.push("/player/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue");
      }
      setIsAccepting(false);
    }
  };

  const onSubmit = async (data: PlayerOnboardingFormData) => {
    if (!invitation) return;

    setError(null);
    setIsSubmitting(true);

    try {
      // Créer le compte et accepter l'invitation
      const response = await fetch(`/api/invitations/${invitationId}/accept-signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          password: data.password,
          email: invitation.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de l'inscription");
      }

      // Se connecter automatiquement
      const signInResult = await signIn.email({
        email: invitation.email,
        password: data.password,
        callbackURL: "/player/dashboard",
      });

      if (signInResult?.error) {
        // Si la connexion échoue, rediriger vers la page de connexion
        router.push(`/login?email=${encodeURIComponent(invitation.email)}`);
      } else {
        // Rediriger vers le dashboard
        router.push("/player/dashboard");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue lors de l'inscription");
      }
      setIsSubmitting(false);
    }
  };

  if (loading || isSessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  // Si l'utilisateur est connecté et correspond à l'invitation mais l'invitation est déjà acceptée
  if (session?.user && invitation && session.user.email === invitation.email && invitation.status === "ACCEPTED") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invitation acceptée</CardTitle>
            <CardDescription>
              Vous avez déjà accepté cette invitation et rejoint l'équipe {invitation.team.name}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/player/dashboard">
              <Button className="w-full">Aller au dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Erreur</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">Aller à la page de connexion</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invitation) {
    return null;
  }

  // Vérifier si l'invitation est expirée
  const isExpired = new Date(invitation.expiresAt) < new Date();
  const isAccepted = invitation.status === "ACCEPTED";
  const isDeclined = invitation.status === "DECLINED";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Rejoindre {invitation.team.name}</CardTitle>
          <CardDescription>
            {invitation.team.coach.name} vous a invité à rejoindre son équipe. Créez votre compte pour accepter l'invitation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isExpired && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4 mb-4">
              <p className="text-sm text-destructive">Cette invitation a expiré.</p>
            </div>
          )}

          {isAccepted && (
            <div className="rounded-lg border border-green-500 bg-green-500/10 p-4 mb-4">
              <p className="text-sm text-green-700 dark:text-green-400">
                Cette invitation a déjà été acceptée.
              </p>
              <Link href="/login">
                <Button className="w-full mt-2">Se connecter</Button>
              </Link>
            </div>
          )}

          {isDeclined && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4 mb-4">
              <p className="text-sm text-destructive">Cette invitation a été refusée.</p>
            </div>
          )}

          {!isExpired && !isAccepted && !isDeclined && (
            <>
              {session?.user && session.user.email === invitation.email ? (
                // Utilisateur connecté avec le bon email - afficher bouton d'acceptation
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Vous êtes connecté avec {invitation.email}. Cliquez sur le bouton ci-dessous pour accepter l'invitation.
                  </p>
                  <Button onClick={handleAcceptInvitation} className="w-full" disabled={isAccepting}>
                    {isAccepting ? "Traitement..." : "Accepter l'invitation"}
                  </Button>
                  {error && (
                    <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}
                </div>
              ) : (
                // Utilisateur non connecté ou mauvais email - afficher formulaire d'inscription
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={invitation.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Cet email ne peut pas être modifié
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className={errors.name && touchedFields.name ? "text-red-600" : ""}>
                  Nom
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    placeholder="Jean Dupont"
                    {...register("name")}
                    disabled={isSubmitting}
                    className={
                      touchedFields.name && errors.name
                        ? "border-red-500 focus-visible:ring-red-500 pr-10"
                        : touchedFields.name && !errors.name && name
                        ? "border-green-500 focus-visible:ring-green-500 pr-10"
                        : ""
                    }
                  />
                  {touchedFields.name && !errors.name && name && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                </div>
                {touchedFields.name && errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className={errors.password && touchedFields.password ? "text-red-600" : ""}>
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                    disabled={isSubmitting}
                    className={
                      touchedFields.password && errors.password
                        ? "border-red-500 focus-visible:ring-red-500 pr-10"
                        : touchedFields.password && !errors.password && password
                        ? "border-green-500 focus-visible:ring-green-500 pr-10"
                        : ""
                    }
                  />
                  {touchedFields.password && !errors.password && password && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                </div>
                {touchedFields.password && errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className={errors.confirmPassword && touchedFields.confirmPassword ? "text-red-600" : ""}>
                  Confirmer le mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    disabled={isSubmitting}
                    className={
                      touchedFields.confirmPassword && errors.confirmPassword
                        ? "border-red-500 focus-visible:ring-red-500 pr-10"
                        : touchedFields.confirmPassword && !errors.confirmPassword && confirmPassword
                        ? "border-green-500 focus-visible:ring-green-500 pr-10"
                        : ""
                    }
                  />
                  {touchedFields.confirmPassword && !errors.confirmPassword && confirmPassword && password === confirmPassword && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                </div>
                {touchedFields.confirmPassword && errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              {error && (
                <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Inscription..." : "Créer mon compte et rejoindre l'équipe"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Vous avez déjà un compte ?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Se connecter
                </Link>
              </p>
            </form>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


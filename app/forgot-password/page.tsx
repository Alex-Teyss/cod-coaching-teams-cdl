"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Helper to extract error message from TanStack Form error object
const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  return String(error)
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm({
    defaultValues: {
      email: "",
    } as ForgotPasswordFormData,
    validatorAdapter: zodValidator(),
    validators: {
      onChange: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      setError("");
      setSuccess(false);
      setIsLoading(true);

      try {
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: value.email }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Une erreur est survenue");
        }

        setSubmittedEmail(value.email);
        setSuccess(true);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Une erreur est survenue lors de l'envoi de l'email");
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Mot de passe oublié</CardTitle>
          <CardDescription>
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-green-500 bg-green-500/10 p-4">
                <p className="text-sm text-green-700 dark:text-green-400">
                  Un email de réinitialisation a été envoyé à <strong>{submittedEmail}</strong>.
                  Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.
                </p>
              </div>
              <Link href="/login">
                <Button className="w-full" variant="outline">
                  Retour à la connexion
                </Button>
              </Link>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-4"
            >
              <form.Field name="email">
                {(field) => {
                  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                  const isValid = field.state.meta.isTouched && field.state.meta.errors.length === 0 && field.state.value;

                  return (
                    <div className="space-y-2">
                      <Label htmlFor={field.name} className={hasError ? "text-red-600" : ""}>
                        Email
                      </Label>
                      <div className="relative">
                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          placeholder="vous@exemple.com"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          disabled={isLoading}
                          className={
                            hasError
                              ? "border-red-500 focus-visible:ring-red-500 pr-10"
                              : isValid
                                ? "border-green-500 focus-visible:ring-green-500 pr-10"
                                : ""
                          }
                        />
                        {isValid && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {hasError && (
                        <p className="text-sm text-red-600">{getErrorMessage(field.state.meta.errors[0])}</p>
                      )}
                    </div>
                  );
                }}
              </form.Field>

              {error && (
                <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <Button type="submit" className="w-full" disabled={!canSubmit || isLoading}>
                    {isSubmitting || isLoading ? "Envoi..." : "Envoyer le lien de réinitialisation"}
                  </Button>
                )}
              </form.Subscribe>

              <div className="text-center">
                <Link href="/login" className="text-sm text-primary hover:underline">
                  Retour à la connexion
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { playerOnboardingSchema, type PlayerOnboardingFormData } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Helper to extract error message from TanStack Form error object
const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  return String(error)
}

export default function PlayerOnboardingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const form = useForm({
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
    } as PlayerOnboardingFormData,
    validatorAdapter: zodValidator(),
    validators: {
      onChange: playerOnboardingSchema,
    },
    onSubmit: async ({ value }) => {
      setError("")
      setIsLoading(true)

      try {
        const response = await fetch("/api/onboarding/complete-player", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: value.name,
            password: value.password,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          setError(result.error || "Une erreur est survenue lors de l'onboarding")
          setIsLoading(false)
          return
        }

        // Redirect to player dashboard
        router.push("/player/dashboard")
      } catch (err: any) {
        setError(err?.message || "Une erreur est survenue lors de l'onboarding")
        console.error(err)
        setIsLoading(false)
      }
    },
  })

  const handleSkip = async () => {
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
      })

      if (!response.ok) {
        setError("Une erreur est survenue")
        setIsLoading(false)
        return
      }

      // Redirect to player dashboard
      router.push("/player/dashboard")
    } catch (err: any) {
      setError(err?.message || "Une erreur est survenue")
      console.error(err)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Finaliser votre profil</CardTitle>
          <CardDescription>
            Vous pouvez mettre à jour votre nom d'affichage et définir un mot de passe, ou conserver vos informations actuelles
          </CardDescription>
        </CardHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <CardContent className="space-y-4">
            <form.Field name="name">
              {(field) => {
                const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0
                const isValid = field.state.meta.isTouched && field.state.meta.errors.length === 0 && field.state.value

                return (
                  <div className="space-y-2">
                    <Label htmlFor={field.name} className={hasError ? "text-red-600" : ""}>
                      Nom d'affichage
                    </Label>
                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        placeholder="Jean Dupont"
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
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 animate-in fade-in zoom-in-50 duration-200">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}
                      {hasError && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600 animate-in fade-in zoom-in-50 duration-200">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {hasError && (
                      <p className="text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {getErrorMessage(field.state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )
              }}
            </form.Field>

            <form.Field name="password">
              {(field) => {
                const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0
                const isValid = field.state.meta.isTouched && field.state.meta.errors.length === 0 && field.state.value

                return (
                  <div className="space-y-2">
                    <Label htmlFor={field.name} className={hasError ? "text-red-600" : ""}>
                      Mot de passe
                    </Label>
                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        placeholder="••••••••"
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
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 animate-in fade-in zoom-in-50 duration-200">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}
                      {hasError && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600 animate-in fade-in zoom-in-50 duration-200">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {hasError && (
                      <p className="text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {getErrorMessage(field.state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )
              }}
            </form.Field>

            <form.Field name="confirmPassword">
              {(field) => {
                const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0
                const isValid = field.state.meta.isTouched && field.state.meta.errors.length === 0 && field.state.value

                return (
                  <div className="space-y-2">
                    <Label htmlFor={field.name} className={hasError ? "text-red-600" : ""}>
                      Confirmer le mot de passe
                    </Label>
                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        placeholder="••••••••"
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
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 animate-in fade-in zoom-in-50 duration-200">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}
                      {hasError && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600 animate-in fade-in zoom-in-50 duration-200">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {hasError && (
                      <p className="text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {getErrorMessage(field.state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )
              }}
            </form.Field>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
          </CardContent>
          <CardFooter className="mt-6 flex flex-col gap-3">
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" className="w-full" disabled={!canSubmit || isLoading}>
                  {isSubmitting || isLoading ? "Configuration..." : "Enregistrer et continuer"}
                </Button>
              )}
            </form.Subscribe>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={handleSkip}
              disabled={isLoading}
            >
              Conserver mes informations actuelles
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

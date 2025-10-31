"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUp } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { signupSchema, type SignupFormData } from "@/lib/validations/auth"

export function SignupForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  })

  const name = watch("name")
  const email = watch("email")
  const password = watch("password")
  const confirmPassword = watch("confirmPassword")

  const onSubmit = async (data: SignupFormData) => {
    setError("")
    setIsLoading(true)

    try {
      await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      })

      router.push("/")
    } catch (err) {
      setError("Une erreur est survenue lors de l'inscription")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Créer un compte</CardTitle>
        <CardDescription>
          Inscrivez-vous pour commencer à utiliser l'application
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
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
                disabled={isLoading}
                className={
                  touchedFields.name && errors.name
                    ? "border-red-500 focus-visible:ring-red-500 pr-10"
                    : touchedFields.name && !errors.name && name
                    ? "border-green-500 focus-visible:ring-green-500 pr-10"
                    : ""
                }
              />
              {touchedFields.name && !errors.name && name && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 animate-in fade-in zoom-in-50 duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
              {touchedFields.name && errors.name && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600 animate-in fade-in zoom-in-50 duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {touchedFields.name && errors.name && (
              <p className="text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className={errors.email && touchedFields.email ? "text-red-600" : ""}>
              Email
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                {...register("email")}
                disabled={isLoading}
                className={
                  touchedFields.email && errors.email
                    ? "border-red-500 focus-visible:ring-red-500 pr-10"
                    : touchedFields.email && !errors.email && email
                    ? "border-green-500 focus-visible:ring-green-500 pr-10"
                    : ""
                }
              />
              {touchedFields.email && !errors.email && email && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 animate-in fade-in zoom-in-50 duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
              {touchedFields.email && errors.email && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600 animate-in fade-in zoom-in-50 duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {touchedFields.email && errors.email && (
              <p className="text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email.message}
              </p>
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
                disabled={isLoading}
                className={
                  touchedFields.password && errors.password
                    ? "border-red-500 focus-visible:ring-red-500 pr-10"
                    : touchedFields.password && !errors.password && password
                    ? "border-green-500 focus-visible:ring-green-500 pr-10"
                    : ""
                }
              />
              {touchedFields.password && !errors.password && password && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 animate-in fade-in zoom-in-50 duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
              {touchedFields.password && errors.password && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600 animate-in fade-in zoom-in-50 duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {touchedFields.password && errors.password && (
              <p className="text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.password.message}
              </p>
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
                disabled={isLoading}
                className={
                  touchedFields.confirmPassword && errors.confirmPassword
                    ? "border-red-500 focus-visible:ring-red-500 pr-10"
                    : touchedFields.confirmPassword && !errors.confirmPassword && confirmPassword
                    ? "border-green-500 focus-visible:ring-green-500 pr-10"
                    : ""
                }
              />
              {touchedFields.confirmPassword && !errors.confirmPassword && confirmPassword && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 animate-in fade-in zoom-in-50 duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
              {touchedFields.confirmPassword && errors.confirmPassword && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600 animate-in fade-in zoom-in-50 duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {touchedFields.confirmPassword && errors.confirmPassword && (
              <p className="text-sm text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 mt-6">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Inscription..." : "S'inscrire"}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Se connecter
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}

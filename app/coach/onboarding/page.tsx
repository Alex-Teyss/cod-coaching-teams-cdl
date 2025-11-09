"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Users, UserPlus, Trophy, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function CoachOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const steps = [
    {
      title: "Bienvenue sur COD Coaching Teams",
      description: "Vous êtes maintenant coach ! Découvrez comment gérer vos équipes et transformer vos joueurs en champions.",
      icon: Trophy,
      color: "blue",
    },
    {
      title: "Créez votre première équipe",
      description: "Une équipe peut contenir jusqu'à 4 joueurs. Vous pourrez gérer plusieurs équipes en même temps.",
      icon: Users,
      color: "purple",
    },
    {
      title: "Invitez vos joueurs",
      description: "Envoyez des invitations par email à vos joueurs. Ils recevront un lien pour rejoindre votre équipe.",
      icon: UserPlus,
      color: "pink",
    },
    {
      title: "C'est parti !",
      description: "Vous êtes prêt à commencer. Créez votre première équipe et invitez vos joueurs pour débuter l'aventure.",
      icon: CheckCircle2,
      color: "green",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/coach/dashboard");
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  const getGradientClass = (color: string) => {
    switch (color) {
      case "blue":
        return "from-blue-500 to-blue-600";
      case "purple":
        return "from-purple-500 to-purple-600";
      case "pink":
        return "from-pink-500 to-pink-600";
      case "green":
        return "from-green-500 to-green-600";
      default:
        return "from-blue-500 to-blue-600";
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 mx-1 rounded-full transition-all duration-300 ${
                  index <= currentStep
                    ? "bg-gradient-to-r " + getGradientClass(steps[index].color)
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Étape {currentStep + 1} sur {steps.length}
          </p>
        </div>

        {/* Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-2xl"
        >
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div
                className={`w-20 h-20 rounded-full bg-gradient-to-br ${getGradientClass(
                  currentStepData.color
                )} bg-opacity-10 flex items-center justify-center`}
              >
                <Icon className={`text-${currentStepData.color}-500`} size={40} strokeWidth={2} />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {currentStepData.title}
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              {currentStepData.description}
            </p>

            {/* Additional content for specific steps */}
            {currentStep === 1 && (
              <div className="bg-muted/50 rounded-lg p-6 mt-6">
                <div className="space-y-3 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                    </div>
                    <p className="text-sm">
                      <strong>Nom de l'équipe:</strong> Choisissez un nom qui représente votre équipe
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                    </div>
                    <p className="text-sm">
                      <strong>Maximum 4 joueurs:</strong> Une équipe complète contient 4 joueurs
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                    </div>
                    <p className="text-sm">
                      <strong>Plusieurs équipes:</strong> Vous pouvez gérer autant d'équipes que vous voulez
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-muted/50 rounded-lg p-6 mt-6">
                <div className="space-y-3 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-pink-500" />
                    </div>
                    <p className="text-sm">
                      <strong>Invitation par email:</strong> Vos joueurs reçoivent un email avec un lien d'invitation
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-pink-500" />
                    </div>
                    <p className="text-sm">
                      <strong>Valide 7 jours:</strong> Les invitations expirent après 7 jours
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-pink-500" />
                    </div>
                    <p className="text-sm">
                      <strong>Suivi en temps réel:</strong> Voyez quand vos joueurs acceptent l'invitation
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-8"
          >
            <ArrowLeft className="mr-2" size={20} />
            Précédent
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              size="lg"
              onClick={handleComplete}
              className="px-8 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              Commencer
              <CheckCircle2 className="ml-2" size={20} />
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleNext}
              className="px-8"
            >
              Suivant
              <ArrowRight className="ml-2" size={20} />
            </Button>
          )}
        </div>

        {/* Skip button */}
        <div className="text-center mt-6">
          <button
            onClick={handleComplete}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Passer l'introduction
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useActionState } from "react";
import { submitContactForm, type ContactState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";

const initialState: ContactState = {};

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast.success("Votre message a été envoyé avec succès !");
      // Optional: Reset form here if we had a ref, but server action re-renders usually clean up if handled right.
      // Actually standard HTML forms don't clear automatically on action unless we explicitly do it.
      // For simplicity in this iteration, we rely on the user seeing the toast.
      // A full reset would require a form ref.
      const form = document.getElementById("contact-form") as HTMLFormElement;
      if (form) form.reset();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <motion.form
      id="contact-form"
      action={formAction}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nom</Label>
          <Input
            id="name"
            name="name"
            placeholder="Votre nom"
            required
            aria-describedby="name-error"
            className={state.errors?.name ? "border-destructive" : ""}
          />
          {state.errors?.name && (
            <p id="name-error" className="text-sm text-destructive">
              {state.errors.name[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="votre@email.com"
            required
            aria-describedby="email-error"
            className={state.errors?.email ? "border-destructive" : ""}
          />
          {state.errors?.email && (
            <p id="email-error" className="text-sm text-destructive">
              {state.errors.email[0]}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Sujet</Label>
        <Input
          id="subject"
          name="subject"
          placeholder="Le sujet de votre message"
          required
          aria-describedby="subject-error"
          className={state.errors?.subject ? "border-destructive" : ""}
        />
        {state.errors?.subject && (
          <p id="subject-error" className="text-sm text-destructive">
            {state.errors.subject[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Votre message..."
          required
          className={`min-h-[150px] ${
            state.errors?.message ? "border-destructive" : ""
          }`}
          aria-describedby="message-error"
        />
        {state.errors?.message && (
          <p id="message-error" className="text-sm text-destructive">
            {state.errors.message[0]}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full md:w-auto" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Envoyer le message
          </>
        )}
      </Button>
    </motion.form>
  );
}

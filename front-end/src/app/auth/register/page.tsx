"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registrationSchema } from "@/lib/schemas/userSchema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      city: "",
      address: "",
      age: undefined,
      role: "CANDIDATE",
    },
  });

  const onSubmit = async (values: RegistrationFormValues) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Utilisateur enregistré avec succès:", data);
      router.push("/auth/login");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
    }
  };

  return (
    <div className="m-auto flex flex-col items-center gap-8 bg-white p-4 rounded-xl shadow-2xl w-auto">
      <h1 className="text-4xl font-bold">Créer un compte</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Votre email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Mot de passe */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Votre mot de passe"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmez le mot de passe</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirmez votre mot de passe"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Prénom */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Votre prénom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Nom */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Votre nom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Numéro de téléphone */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="Votre numéro de téléphone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Ville */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ville</FormLabel>
                <FormControl>
                  <Input placeholder="Votre ville" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Adresse */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input placeholder="Votre adresse" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Âge */}
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Âge</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Votre âge"
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Rôle */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rôle</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisissez un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CANDIDATE">Candidat</SelectItem>
                      <SelectItem value="RECRUITER">Recruteur</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-gray-700 hover:bg-gray-400 text-white rounded-lg py-2"
          >
            S'inscrire
          </Button>
          <p className="text-center">
            Déjà un compte ?{" "}
            <Link href="/auth/login" className="text-gray-500 hover:underline">
              Se connecter
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}

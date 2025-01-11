"use client";

import { InputLogin } from "@/components/ui/input";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login_check`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      const token = data.token;

      // Stocker le token dans le localStorage
      localStorage.setItem("token", token);

      // Appeler la fonction login pour mettre à jour l'état d'authentification
      login(token);

      // Rediriger l'utilisateur après une connexion réussie
      router.push("/");
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div className="bg-gray-600 min-h-screen">
      <div className="flex justify-center pt-20 pb-10">
        <p className="text-2xl text-white">LOGO</p>
      </div>
      <div className="flex flex-col justify-center items-center text-white text-2xl">
        Se connecter
        <form
          onSubmit={handleLogin}
          className="w-80 mt-6 text-black flex flex-col gap-6"
        >
          <InputLogin
            placeholder="Adresse Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputLogin
            placeholder="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-center">
            <Button type="submit" className="mt-2 w-56 rounded-full text-xl">
              Connexion
            </Button>
          </div>
        </form>
        <p className="text-red-600 text-sm mt-4">{error}</p>
      </div>
      <p className="mx-auto text-center text-white underline underline-offset-4 mt-6">
        Mot de passe oublié ?
      </p>

      <div className="flex justify-center">
        <div className=" mt-8 w-80 border-t border-gray-300"></div>
      </div>
      <h3 className="text-white font-bold text-2xl text-center mt-4">
        Nouveau Membre
      </h3>
      <p className="text-center mt-2 text-white">
        Vous êtes élève ou professeur ?
      </p>
      <p className="text-center text-white ">
        Créer votre espace membre pour acceder à toute l'application
      </p>

      <div className="flex justify-center mt-4">
        <Button type="button" className=" w-56 rounded-full text-xl ">
          S'inscrire
        </Button>
      </div>
      <footer className="mt-24 text-white">
        <p className="text-center">Job Office</p>
        <p className="text-center">Mention Légal/FAQ</p>
      </footer>
    </div>
  );
};

export default LoginPage;

"use client";

import { useUser } from "./context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // Redirection basée sur le rôle
      if (user.roles.includes("ROLE_CANDIDATE")) {
        router.push("/candidates");
      } else if (user.roles.includes("ROLE_RECRUITER")) {
        router.push("/recruiters");
      }
    } else {
      // Redirige vers la connexion si non connecté
      router.push("/auth/login");
    }
  }, [user, router]);

  return <p>Redirection en cours...</p>;
}

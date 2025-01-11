"use client";

import { useState, useEffect, useCallback } from "react";
import { Job } from "@/interfaces/Job";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";
import LogoutButton from "../_components/logoutButton";
import JobCard from "../_components/JobCard";
import SearchBar from "../_components/SearchBar";

const HomePage = () => {
  const { user } = useUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data: Job[] = await res.json();

      if (data) {
        setJobs(data);
      } else {
        console.error("La réponse de l'API ne contient pas de données.");
      }
      console.log("Corps de la réponse :", data);
      console.log("Données de l'utilisateur :", user?.id);
    } catch (error) {
      console.error("Erreur lors de la récupération des emplois :", error);
    } finally {
      setLoading(false);
    }
  }, [token, user?.id]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else {
      fetchJobs();
    }
  }, [isAuthenticated, router, fetchJobs]);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-4 pt-20">
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <p className="text-xl font-semibold">Bonjour {user?.firstName},</p>
      <LogoutButton />
      <div className="flex flex-col gap-4">
        {filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;

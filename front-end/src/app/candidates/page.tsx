"use client";

import { useState, useEffect, useCallback } from "react";
import { Job } from "@/interfaces/Job";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";
import JobHomeCard from "../_components/Job/JobCard";
import AlertResume from "../_components/Mes-alertes/AlertResume";
import ApplyResume from "../_components/Candidatures/ApplyResume";
import Link from "next/link";
import { Application } from "@/interfaces/Application";
import JobSearchBar from "../_components/Barre-de-recherche/JobSearchBar";
import LocationSearchBar from "../_components/Barre-de-recherche/LocationSearchBar";
import { IoSearchCircle } from "react-icons/io5";

const HomePage = () => {
  const { user } = useUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [jobSearchTerm, setJobSearchTerm] = useState("");

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

  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${user?.id}/applications-details`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data: Application[] = await res.json();
      if (data) {
        setApplications(data);
      } else {
        console.error("La réponse API ne contient pas de données");
      }
    } catch (error) {
      console.error(error);
    }
  }, [token, user?.id]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else {
      fetchJobs();
      fetchApplications();
    }
  }, [isAuthenticated, router, fetchJobs, fetchApplications]);

  const handleSearch = () => {
    router.push(
      `/candidates/jobs?job=${jobSearchTerm}&location=${locationSearchTerm}`
    );
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="pt-[70px] bg-[#F6F6F6]">
      {/* SECTION SEARCH BAR */}
      <div className="h-20 w-full bg-sky-500">
        <div className="container mx-auto h-20 flex justify-center items-center gap-6">
          <JobSearchBar
            jobSearchTerm={jobSearchTerm}
            setJobSearchTerm={setJobSearchTerm}
          />
          <LocationSearchBar
            locationSearchTerm={locationSearchTerm}
            setLocationSearchTerm={setLocationSearchTerm}
          />
          <button onClick={handleSearch} className="hover:text-white">
            <IoSearchCircle className="" size={55} />
          </button>
        </div>
      </div>
      {/* CONTAINER DE LA PAGE */}
      <div className="container mx-auto md:px-12 lg:px-20 flex gap-6 mt-6">
        {/* BLOC DE GAUCHE */}
        <div className="w-2/3 flex flex-col gap-6">
          <p className="text-2xl">
            Salut{" "}
            <span className="text-3xl font-semibold">{user?.firstName}</span> !
            Vous avez 5 messages
          </p>
          {/* BLOC CAROUSEL */}
          <div>
            <div className="h-52 bg-gray-600  rounded-md"></div>
          </div>
          {/* BLOC OFFRES RECOMMANDÉS */}
          <div className="flex flex-col gap-6">
            <h3 className="text-2xl">Mes offres recommandées</h3>
            {jobs.map((job) => (
              <JobHomeCard key={job.id} job={job} />
            ))}
          </div>
        </div>
        {/* BLOC DE DROITE */}
        <div className="w-1/3 flex flex-col gap-6">
          {/* MES ALERTES */}
          <div className="w-full rounded-t-md">
            <div className="h-12 bg-[#FFD36E] rounded-t-md flex items-center p-4">
              <h3>Mes Alertes</h3>
            </div>
            <div className="p-4 bg-white">
              <div className=" flex flex-col gap-4   ">
                <AlertResume />
                <AlertResume />
                <AlertResume />
              </div>
              <div className="flex justify-center items-center mt-4 ">
                <button className="text-center border border-black rounded-full p-2 hover:bg-black hover:text-white ">
                  Je crée mon alerte
                </button>
              </div>
            </div>
          </div>
          {/* MES CANDIDATURES */}
          <div className="w-full rounded-t-md">
            <div className="h-12 bg-[#D1B7FA] rounded-t-md flex items-center p-4">
              <h3>Mes candidatures</h3>
            </div>
            <div className="p-4 bg-white">
              <div className=" flex flex-col gap-4   ">
                {applications.slice(0, 3).map((application) => (
                  <ApplyResume key={application.id} application={application} />
                ))}
              </div>
              <div className="flex justify-center items-center mt-4">
                <Link href="/candidates/applications">
                  <button className="text-center border border-black rounded-full p-2 hover:bg-black hover:text-white ">
                    Voir toutes les candidatures
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

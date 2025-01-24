"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Job } from "@/interfaces/Job";
import { useAuth } from "../../context/AuthContext";
import JobCard from "@/app/_components/Job/JobCard";

const JobSearchResultsPage = () => {
  const searchParams = useSearchParams();
  const job = searchParams.get("job");
  const location = searchParams.get("location");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jobs/search?title=${job}&location=${location}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data && Array.isArray(data.results)) {
          setJobs(data.results);
        } else {
          console.error(
            "La réponse de l'API n'est pas structurée comme prévu :",
            data
          );
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des emplois :", error);
      } finally {
        setLoading(false);
      }
    };

    if (job || location) {
      fetchJobs();
    }
  }, [job, location, token]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="pt-[70px] bg-[#F6F6F6]">
      <div className="container mx-auto md:px-12 lg:px-20 flex gap-6 mt-6">
        <div className="w-full flex flex-col gap-6">
          <h3>Résultats de la recherche</h3>
          {jobs.length > 0 ? (
            jobs.map((job) => <JobCard key={job.id} job={job} />)
          ) : (
            <p>Aucun résultat trouvé</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearchResultsPage;

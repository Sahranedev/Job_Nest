"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Job } from "@/interfaces/Job";
import { IoArrowBackSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useUser } from "../../../context/UserContext";
import { useAuth } from "../../../context/AuthContext";

const JobDetailsPage = () => {
  const { user } = useUser();
  const { token } = useAuth();
  const params = useParams();
  const jobId = params.jobId;
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/job/${jobId}`
        );
        if (!res.ok) {
          throw new Error("Erreur lors de la récupération des détails du job");
        }
        const data: Job = await res.json();
        setJob(data);
        console.log("params", params);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || "Erreur inconnue");
        } else {
          setError("Erreur inconnue");
        }
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId, params]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!job) {
    return <p>Chargement des détails du job...</p>;
  }

  const applyForJob = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/applications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            job_id: job?.id,
            user_id: user?.id,
            cover_letter: "Votre lettre de motivation ici",
            resume_path: "chemin/vers/votre/cv.pdf",
          }),
        }
      );
      if (!res.ok) {
        throw new Error("Erreur lors de la postulation au job");
      }
      router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erreur inconnue");
      } else {
        setError("Erreur inconnue");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="pointer flex gap-2 items-center"
      >
        <IoArrowBackSharp />
        Revenir
      </button>
      <h1 className="text-3xl font-bold">{job.title}</h1>
      <p className="mt-2 text-gray-700">{job.description}</p>
      <p className="mt-4 text-sm text-gray-500">
        Publié par : {job.company_name} - {job.location}
      </p>
      <div className="mt-4">
        <span className="px-4 py-2 border border-black text-center rounded-full">
          Type : {job.type}
        </span>
      </div>
      <Button className="mt-4" onClick={applyForJob}>
        Postuler
      </Button>
    </div>
  );
};

export default JobDetailsPage;

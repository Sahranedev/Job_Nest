"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Job } from "@/interfaces/Job";
import { useUser } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";
import JobCard from "@/app/_components/Job/JobCard";

const CandidatesApplicationsPage = () => {
  const { token, isAuthenticated } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [applications, setApplications] = useState<Job[] | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${user?.id}/applications`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data: Job[] = await res.json();
        if (data) {
          console.log("data :", data);
          setApplications(data);
        } else {
          console.error("La réponse API ne contient pas de données");
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else {
      fetchApplication();
    }
  }, [router, token, user?.id, isAuthenticated]);

  return (
    <div>
      <p>MES CANDIDATURES</p>
      <div>
        {applications?.map((application) => (
          <JobCard key={application.id} job={application} />
        ))}
      </div>
    </div>
  );
};

export default CandidatesApplicationsPage;

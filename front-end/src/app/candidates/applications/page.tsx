"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Job } from "@/interfaces/Job";
import { useUser } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";
import JobCardApplications from "@/app/_components/Job/JobCardApplications";

const CandidatesApplicationsPage = () => {
  const { token, isAuthenticated } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [applications, setApplications] = useState<Job[] | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
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
    <div className="container mx-auto  flex gap-6 mt-24 border border-red-600">
      <div className=" border border-blue-600 mt-6 w-2/3">
        <p>MES CANDIDATURES</p>
        {applications?.map((application) => (
          <JobCardApplications key={application.id} job={application} />
        ))}
      </div>
    </div>
  );
};

export default CandidatesApplicationsPage;

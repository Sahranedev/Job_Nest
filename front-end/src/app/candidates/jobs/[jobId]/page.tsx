"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Job } from "@/interfaces/Job";
import { IoArrowBackSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useUser } from "../../../context/UserContext";
import { useAuth } from "../../../context/AuthContext";
import Image from "next/image";

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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/job/${jobId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/applications`,
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
      router.push("/candidates");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erreur inconnue");
      } else {
        setError("Erreur inconnue");
      }
    }
  };

  return (
    <div className="container mx-auto lg:px-32 py-8 mt-20">
      {/* IMAGE COVER */}
      <div className="relative">
        <Image
          src="/arinfo.jpeg"
          alt="Image de l'entreprise"
          width={1000}
          height={400}
          className="w-full h-60 object-cover rounded-lg bg"
        />
        <div className="absolute bottom-4 left-20 bg-white p-2 rounded-tr-lg">
          <Image
            src="/capg_logo.png"
            alt="Logo de l'entreprise"
            width={65}
            height={55}
            className="object-contain"
          />
        </div>
      </div>
      {/*  */}
      <button
        onClick={() => router.back()}
        className="pointer flex gap-2 items-center"
      >
        <IoArrowBackSharp />
        Revenir
      </button>
      {/* CONTAINER */}
      <div className="container mx-auto mt-12 flex gap-6">
        {/* BLOC GAUCHE */}
        <div className="w-2/3">
          {/* TITRE DU JOB */}
          <h2 className="text-4xl ">{job.title}</h2>
          <div className="mt-2">
            {/* INFOS JOB (Entreprise, localisation, type de contrat) */}
            <div className="flex gap-6">
              <p className="text-gray-400">{job.company_name}</p>
              <p className="text-gray-400"> {job.location}</p>
              <p className="text-gray-400">{job.type}</p>
            </div>
          </div>
          {/* DESCRIPTION DU JOB */}
          <div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
              mollitia voluptatem tempore dolorem inventore recusandae.
              Molestiae accusamus iste perferendis dolor voluptatum. Totam,
              vitae sit libero fugit quam nam eaque neque. Incidunt animi nemo
              commodi laborum tempora nihil, iste ut molestias. Ipsum tempore,
              impedit consectetur repellendus soluta, fuga reprehenderit
              perferendis adipisci dignissimos doloremque illo dolor, voluptas
              fugiat pariatur corporis quos officia accusantium! Harum quaerat
              culpa, temporibus repellendus eius reprehenderit nisi dolor.
              Dolorem commodi modi itaque sint sapiente molestias aspernatur,
              ipsa tenetur quas alias, quaerat quis laudantium vero, non
              consequuntur! Molestiae harum itaque sunt officia tenetur neque,
              aperiam praesentium asperiores alias maiores placeat ipsam
              expedita consequatur assumenda voluptas porro laborum aliquid
              perspiciatis nesciunt ex id laudantium accusamus illo! Magni vero
              nulla recusandae voluptatem quod eveniet assumenda aliquam! Omnis,
              ea numquam accusamus reiciendis nesciunt sed inventore velit,
              debitis vel harum illum modi id? Exercitationem incidunt nisi
              repellat impedit consectetur, inventore distinctio optio, eius,
              esse enim eos facere laudantium earum numquam. Quaerat repellendus
              officia harum odio laborum id architecto consectetur recusandae
              labore laboriosam dolor reprehenderit illum commodi blanditiis
              fugiat rem magni, perspiciatis et vel nam facilis. Facilis
              distinctio repudiandae explicabo obcaecati ipsa, ducimus
              dignissimos exercitationem ratione vitae quibusdam dolorum
              pariatur deserunt nulla optio rerum et voluptatum similique? Sint
              soluta provident at labore odit quas aspernatur ut ipsum obcaecati
              necessitatibus molestiae officiis velit possimus molestias quod
              tempore similique ipsam, nam repudiandae quos. Iure aliquid
              incidunt consequuntur ab dolores facilis ipsa natus harum neque
              quos itaque deleniti sapiente numquam vero quibusdam delectus sint
              consequatur quia repudiandae voluptates reiciendis, error sequi
              cupiditate. Dolore illo culpa maiores ipsa inventore accusamus
              dignissimos, tenetur earum amet sunt officiis sint possimus harum
              laborum? Commodi molestias deserunt perspiciatis soluta, nisi odio
              sint unde. Incidunt, rerum voluptatem inventore, sequi neque
              impedit reiciendis quam eaque vitae doloremque perferendis sit
              nisi ipsum aspernatur, facilis repellat?
            </p>
          </div>
        </div>
        {/* BLOC DROIT */}
        <div className="w-1/3 ">
          <div className="w-auto border border-slate-300 p-4 rounded-md flex flex-col">
            <h3 className="text-2xl text-center">{job.title}</h3>
            <p className="underline mt-4">{job.company_name}</p>
            <div className="flex gap-2 mt-4 items-center">
              <p className="bg-gray-200 rounded-lg px-1">{job.location}</p>
              <p className="bg-gray-200 rounded-lg px-1">{job.type}</p>
            </div>
            <button
              onClick={applyForJob}
              type="button"
              className="mx-auto text-white py-2 w-3/4 bg-purple-700 mt-10 rounded-full"
            >
              Postuler
            </button>
            <span className="text-sm text-gray-400 mt-4">
              Publiée le {job.createdAt}{" "}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;

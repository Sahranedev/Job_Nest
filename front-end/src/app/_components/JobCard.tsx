/* eslint-disable react/no-unescaped-entities */
import { Job } from "@/interfaces/Job";
import { Card, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import Link from "next/link";

interface JobCardComponentProps {
  job: Job;
}

const JobCard: React.FC<JobCardComponentProps> = ({ job }) => {
  return (
    <Card className="rounded-2xl flex justify-around">
      {/* BLOC GAUCHE */}
      <div className="w-4/5 flex p-4">
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-gray-700">
            {job.company_name}
          </p>
          <p className="font-bold">{job.title}</p>
          <div className="flex gap-2">
            <Badge variant="outline">{job.location}</Badge>
            <Badge variant="outline">{job.type}</Badge>
          </div>
        </div>
        <div className="flex items-center">
          <CardDescription className=" py-2 px-4 ">
            {job.description}
          </CardDescription>
        </div>
      </div>
      {/* BLOC VOIR OFFRES */}
      <div className="w-1/5 flex justify-center items-center">
        <Link href={`/candidates/jobs/${job.id}`}>
          <button className=" border border-black text-center rounded-full cursor-pointer hover:bg-gray-100 p-2">
            Voir l'offre
          </button>
        </Link>
      </div>
    </Card>
  );
};

export default JobCard;

import { Job } from "@/interfaces/Job";
import { Card, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { CiBookmark } from "react-icons/ci";
import Link from "next/link";

interface JobCardComponentProps {
  job: Job;
}

const JobCard: React.FC<JobCardComponentProps> = ({ job }) => {
  return (
    <Card className="rounded-2xl">
      <div className="flex justify-between">
        <div className="flex">
          <Image
            src="/capg_logo.png"
            width={10}
            height={10}
            className="size-14"
            alt="Job"
          />
          <div className="flex flex-col  justify-center">
            <p className="text-sm font-semibold text-gray-700">
              {job.company_name}
            </p>
            <p className="font-bold">{job.title}</p>
            <div className="flex gap-2">
              <Badge variant="outline">{job.location}</Badge>
              <Badge variant="outline">{job.type}</Badge>
            </div>
          </div>
        </div>
        <p className="flex justify-end">
          <CiBookmark size={24} />
        </p>
      </div>
      <div className="flex justify-center mt-4">
        <div className="h-0.5 w-[80%] flex items-center justify-center bg-gray-400 "></div>
      </div>
      <CardDescription className="text-wrap py-2 px-4 ">
        {job.description}
      </CardDescription>
      <div className="mt-2 pb-2">
        <Link href={`/candidates/jobs/${job.id}`}>
          <span className="ml-4 px-4 py-2 border border-black text-center rounded-full cursor-pointer hover:bg-gray-100">
            Voir les détails
          </span>
        </Link>
      </div>
    </Card>
  );
};

export default JobCard;

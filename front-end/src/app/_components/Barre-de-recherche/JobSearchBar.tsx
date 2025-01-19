import React from "react";
import { Input } from "@/components/ui/input";

interface JobSearchBarProps {
  jobSearchTerm: string;
  setJobSearchTerm: (term: string) => void;
}

const JobSearchBar: React.FC<JobSearchBarProps> = ({
  jobSearchTerm,
  setJobSearchTerm,
}) => {
  return (
    <div className="w-1/4">
      <Input
        type="text"
        value={jobSearchTerm}
        onChange={(e) => setJobSearchTerm(e.target.value)}
        placeholder="Quoi ? Exemple : Développeur full-stack"
        className="bg-white"
      />
    </div>
  );
};

export default JobSearchBar;

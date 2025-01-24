"use client";

import { useState } from "react";
import { Job } from "@/interfaces/Job";
import { Input } from "@/components/ui/input";
import { User } from "@/interfaces/User";

interface ApplyComponentProps {
  job: Job;
  user: User;
  onClose: () => void;
  onSubmit: (application: {
    job_id: number;
    user_id: number;
    cover_letter: string;
    resume_path: string;
  }) => void;
}

const ModalConfirmApply: React.FC<ApplyComponentProps> = ({
  user,
  job,
  onClose,
  onSubmit,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    onSubmit({
      job_id: job.id,
      user_id: user.id,
      cover_letter: "",
      resume_path: user.cv_path,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-[44rem] h-[26rem]">
      <h2 className="text-xl mb-4">Confirmer votre candidature</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4 flex gap-4 w-full">
        <div className="w-1/2">
          <label className="block text-gray-700">Prénom</label>
          <Input value={user.firstName} readOnly className="" />
        </div>
        <div className="w-1/2">
          <label className="block text-gray-700">Nom</label>
          <Input value={user.lastName} readOnly className="" />
        </div>
      </div>
      <div className="mb-4 flex gap-4 w-full">
        <div className=" w-1/2">
          <label className="block text-gray-700">Email</label>
          <Input value={user.email} readOnly className="" />
        </div>
        <div className="w-1/2">
          <label className="block text-gray-700">CV</label>
          <input
            type="text"
            value={user.cv_path}
            className="w-full p-2 border rounded"
            readOnly
          />
        </div>
      </div>
      <div className="flex  flex-col justify-center items-center gap-6">
        <button
          onClick={handleSubmit}
          className="mx-auto text-white py-2 w-1/2 bg-purple-700  rounded-full hover:bg-purple-500"
        >
          Postuler
        </button>
        <button
          onClick={onClose}
          className="bg-red-600 text-white py-2 px-4 rounded-full w-1/2 hover:bg-red-800"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default ModalConfirmApply;

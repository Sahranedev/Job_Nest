"use client";

import { Application } from "@/interfaces/Application";

interface ApplyComponentProps {
  application: Application;
}

const AlertResume: React.FC<ApplyComponentProps> = ({
  application,
}: {
  application: Application;
}) => {
  return (
    <div>
      <p className="text-xs text-gray-400">{application.createdAt}</p>
      <p>{application.title}</p>
    </div>
  );
};

export default AlertResume;

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
      <p>{application.title}</p>
    </div>
  );
};

export default AlertResume;

"use client";

import { Switch } from "@/components/ui/switch";

const PersonnalCv = () => {
  return (
    <div>
      {/* Conteneur a l'interieur du conteneur */}
      <div className="container mx-auto">
        <p>
          J'organise mes CV pour candidater et être visible auprès des
          recruteurs
        </p>
        {/* Mon CV par défaut */}
        <div>
          <p className="mt-4 text-sm">Mon CV par défaut</p>
        </div>
        <div className="mt-4 flex items-center gap-8">
          <p>
            CV visible auprès des recruteurs<span> ?</span>
          </p>
          <Switch />
        </div>
      </div>
    </div>
  );
};

export default PersonnalCv;

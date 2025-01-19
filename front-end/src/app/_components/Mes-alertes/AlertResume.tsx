"use client";
import { BsBell } from "react-icons/bs";

const AlertResume = () => {
  return (
    <div className="flex  justify-between ">
      <div className="flex gap-2">
        <BsBell size={20} />
        <p>Nom de l'alerte</p>
      </div>
      <div>
        <p>Voir les offres</p>
      </div>
    </div>
  );
};

export default AlertResume;

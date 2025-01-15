"use client";
import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import PersonalInfoForm from "@/app/_components/PersonalInfoForm"; // Importer le composant
import PersonnalCv from "@/app/_components/PersonnalCv"; // Importer le composant

const ProfilePage = () => {
  const { token, isAuthenticated } = useAuth();
  const { user } = useUser();
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  const handleBlockClick = (block: string) => {
    setSelectedBlock(block);
  };

  return (
    <div className="container mx-auto p-4 mt-20">
      {/* HEADER DATA */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 bg-white p-4 shadow-md rounded-lg border border-slate-300 h-auto md:h-full">
          <div className="flex items-center gap-6">
            <Avatar>
              <AvatarImage src="/rak.jpeg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-2xl">
                {user?.firstName} {user?.lastName}
              </p>
              <p>{user?.city}</p>
            </div>
          </div>
          {/* CV CONSULTATION */}
          <div className="flex items-center justify-center h-10 w-auto bg-gray-100 mt-4 rounded-lg">
            <p className="">
              Votre CV a été consulté par
              <span className="font-bold underline"> 8 recruteurs</span>
            </p>
          </div>
          {/* PROGRESS BAR */}
          <p className="mt-2">Profil complété à : </p>
          <div className="flex mt-2 items-center gap-4">
            <p>77%</p>
            <Progress value={77} className="" />
          </div>
        </div>
        <div className="md:w-2/3">
          {!selectedBlock ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="bg-white p-4 shadow-md rounded-lg h-48 border border-slate-100 cursor-pointer"
                onClick={() => handleBlockClick("Ma recherche")}
              >
                <p>Ma recherche</p>
              </div>
              <div
                className="bg-white p-4 shadow-md rounded-lg h-48 border border-slate-100 cursor-pointer"
                onClick={() => handleBlockClick("Ma situation actuelle")}
              >
                <p>Ma situation actuelle</p>
              </div>
              <div
                className="bg-white p-4 shadow-md rounded-lg h-48 border border-slate-100 cursor-pointer"
                onClick={() => handleBlockClick("Mes CV")}
              >
                <p>Mes CV</p>
              </div>
              <div
                className="bg-white p-4 shadow-md rounded-lg h-48 border border-slate-100 cursor-pointer"
                onClick={() =>
                  handleBlockClick("Mes informations personnelles")
                }
              >
                <p>Mes informations personnelles</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-6">
                <div
                  className="bg-white p-4 shadow-md rounded-lg h-24 border border-slate-100 cursor-pointer"
                  onClick={() => handleBlockClick("Ma recherche")}
                >
                  <p>Ma recherche</p>
                </div>
                <div
                  className="bg-white p-4 shadow-md rounded-lg h-24 border border-slate-100 cursor-pointer"
                  onClick={() => handleBlockClick("Ma situation actuelle")}
                >
                  <p>Ma situation actuelle</p>
                </div>
                <div
                  className="bg-white p-4 shadow-md rounded-lg h-24 border border-slate-100 cursor-pointer"
                  onClick={() => handleBlockClick("Mes CV")}
                >
                  <p>Mes CV</p>
                </div>
                <div
                  className="bg-white p-4 shadow-md rounded-lg h-24 border border-slate-100 cursor-pointer"
                  onClick={() =>
                    handleBlockClick("Mes informations personnelles")
                  }
                >
                  <p>Mes informations personnelles</p>
                </div>
              </div>
              <div className="bg-white p-4 shadow-md rounded-lg mt-6 border border-slate-300">
                <h2 className="text-xl font-bold mb-4">{selectedBlock}</h2>
                {selectedBlock === "Mes informations personnelles" && (
                  <PersonalInfoForm />
                )}
                {selectedBlock === "Mes CV" && <PersonnalCv />}
                {/* Ajouter d'autres composants dynamiques ici */}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;

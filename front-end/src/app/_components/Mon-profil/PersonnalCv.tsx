import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

const PersonnalCv = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const { token } = useAuth();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Veuillez sélectionner un fichier.");
      return;
    }

    const formData = new FormData();
    formData.append("cv", file);

    const response = await fetch("http://localhost:8000/api/upload-cv", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    setMessage(result.message || "Erreur lors de l'upload.");
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload CV</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PersonnalCv;

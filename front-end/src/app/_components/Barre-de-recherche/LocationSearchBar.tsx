import React from "react";
import { Input } from "@/components/ui/input";

interface LocationSearchBarProps {
  locationSearchTerm: string;
  setLocationSearchTerm: (term: string) => void;
}

const LocationSearchBar: React.FC<LocationSearchBarProps> = ({
  locationSearchTerm,
  setLocationSearchTerm,
}) => {
  return (
    <div className="w-1/4">
      <Input
        type="text"
        value={locationSearchTerm}
        onChange={(e) => setLocationSearchTerm(e.target.value)}
        placeholder="Où ? Exemple : Paris, 75000"
        className="bg-white"
      />
    </div>
  );
};

export default LocationSearchBar;

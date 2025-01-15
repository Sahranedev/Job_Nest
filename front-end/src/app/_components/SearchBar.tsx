import React from "react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mb-4 fixed top-0 left-0 right-0 bg-white z-10 p-4 ">
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Rechercher des emplois..."
        className=""
      />
    </div>
  );
};

export default SearchBar;

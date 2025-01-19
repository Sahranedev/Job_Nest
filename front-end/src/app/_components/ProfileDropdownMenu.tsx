import Link from "next/link";
import { FaRegUser } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import LogoutButton from "./logoutButton";
import { useUser } from "../context/UserContext";

const ProfileDropdownMenu = () => {
  const { user } = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="p-2 border border-white rounded-full flex items-center gap-2 cursor-pointer hover:bg-white hover:text-black"
        >
          <FaRegUser />
          <p>{user?.firstName}</p>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href="/candidates/jobs">Mes offres</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/candidates/alerts">Mes alertes</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/candidates/messages">Mes messages</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/candidates/profile">Mon profil</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogoutButton className="w-full text-left" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdownMenu;

"use client";

import Link from "next/link";

import { useUser } from "../context/UserContext";
import { FaRegUser } from "react-icons/fa";

const NavBar = () => {
  const { user } = useUser();
  return (
    <nav className="fixed top-0 left-0 right-0 flex items-center justify-around p-4 bg-slate-900 text-white">
      <Link href="/">
        <div>
          <p className="text-2xl font-bold">JobNest</p>
        </div>
      </Link>
      <ul className="flex space-x-4 items-center">
        <li>
          <Link href="/candidates/profile" className="flex items-center">
            <button
              type="button"
              className="p-2 border border-white rounded-full flex items-center gap-2"
            >
              <FaRegUser />
              <p>{user?.firstName}</p>
            </button>
          </Link>
        </li>
      </ul>
    </nav>
  );
};
export default NavBar;

"use client";

import Link from "next/link";
import ProfileDropdownMenu from "../ProfileDropdownMenu";

const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 flex items-center justify-around p-4 bg-slate-900 text-white">
      <Link href="/">
        <div>
          <p className="text-2xl font-bold">JobNest</p>
        </div>
      </Link>
      <ul className="flex space-x-4 items-center">
        <li>
          <ProfileDropdownMenu />
        </li>
      </ul>
    </nav>
  );
};
export default NavBar;

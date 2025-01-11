"use client";

import BottomNav from "./_components/BottomNav";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { usePathname } from "next/navigation";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Définir les chemins pour lesquels la navbar ne doit pas apparaître
  const hideNavbarRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
  ];

  // Affiche la navbar uniquement si le chemin actuel n'est pas dans hideNavbarRoutes
  const showNavbar = !hideNavbarRoutes.includes(pathname);

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <UserProvider>
            <div className="min-h-screen pb-14">{children}</div>
            {showNavbar && <BottomNav />}{" "}
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

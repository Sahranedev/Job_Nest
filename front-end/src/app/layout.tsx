"use client";

import BottomNav from "./_components/Navigation/BottomNav";
import NavBar from "./_components/Navigation/NavBar";
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

  // j'affiche la navbar uniquement si le chemin actuel n'est pas dans hideNavbarRoutes
  const showNavbar = !hideNavbarRoutes.includes(pathname);

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <UserProvider>
            <div className="min-h-screen">{children}</div>
            {showNavbar && (
              <>
                <div className="block md:hidden">
                  <BottomNav />
                </div>
                <div className="hidden md:block">
                  <NavBar />
                </div>
              </>
            )}
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const LogoutButton = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    localStorage.clear();

    logout();

    router.push("/auth/login");
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;

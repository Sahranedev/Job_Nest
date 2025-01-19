import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface LogoutButtonProps {
  className?: string;
}

const LogoutButton = ({ className, ...props }: LogoutButtonProps) => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    localStorage.clear();
    logout();
    router.push("/auth/login");
  };

  return (
    <button onClick={handleLogout} className={className} {...props}>
      Se déconnecter
    </button>
  );
};

export default LogoutButton;

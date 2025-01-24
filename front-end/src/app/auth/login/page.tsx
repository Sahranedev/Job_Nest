"use client";

import { InputLogin } from "@/components/ui/input";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Lottie from "react-lottie";
import { toast, Bounce } from "react-toastify";
import animationData from "../../../../public/lottie/job_animation.json";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "@/lib/schemas/userSchema";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const LoginPage = () => {
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  type LoginFormValues = z.infer<typeof loginSchema>;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login_check`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: values.email,
            password: values.password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      const token = data.token;

      localStorage.setItem("token", token);

      login(token);

      toast.success(
        () => (
          <div>
            Hello {user?.firstName} 👋 , bienvenue sur{" "}
            <span className="font-bold">Job Nest</span>
          </div>
        ),
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        }
      );

      router.push("/");
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex">
      {/* BLOC DE GAUCHE */}
      <div className="min-h-screen w-1/2 flex items-center justify-center bg-[#2C2638]">
        <div className="bg-violet-200/50 h-5/6 w-5/6 flex items-center justify-center rounded-md">
          {/* ANIMATION LOTTIE */}
          <Lottie
            options={defaultOptions}
            height="100%"
            width="100%"
            speed={1}
          />
        </div>
      </div>
      {/* BLOC DE DROITE */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-[#2C2638]">
        <h1 className="text-4xl font-bold text-white">Se connecter</h1>
        <div className="w-1/2 ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className="flex flex-col gap-4 w-full mt-10"
            >
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputLogin placeholder="Email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Mot de passe */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputLogin
                        placeholder="Mot de passe"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-[#6D54B5] hover:bg-gray-400 text-white rounded-lg py-6"
              >
                Se connecter
              </Button>
              {error && <p className="text-red-500">{error}</p>}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
